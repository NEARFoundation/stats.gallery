use std::{collections::HashSet, ops::Sub, sync::Arc};

use chrono::Duration;
use dotenv::dotenv;

use futures::future::join_all;
use near_jsonrpc_client::JsonRpcClient;
use near_primitives::types::AccountId;
use serde::Deserialize;
use sqlx::{migrate, postgres::PgPoolOptions};
use tokio::{
    join,
    sync::{broadcast, Mutex, Semaphore},
};
use tracing::{error, info};

use crate::{
    badge::{transfer, BadgeRegistry},
    connections::Connections,
    indexer::get_recent_actors,
    local::{add_badge_for_account, get_badges_for_account, query_account},
};

#[inline]
const fn default_account_threads() -> usize {
    16
}

#[inline]
const fn default_pool_connections() -> u32 {
    5
}

#[derive(Deserialize)]
struct Configuration {
    pub database_url: String,
    pub indexer_url: String,
    pub rpc_url: String,
    #[serde(default = "default_account_threads")]
    pub account_threads: usize,
    #[serde(default = "default_pool_connections")]
    pub local_pool_connections: u32,
    #[serde(default = "default_pool_connections")]
    pub indexer_pool_connections: u32,
}

mod badge;
mod connections;
mod indexer;
mod local;
mod rpc;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();
    migrate!();

    let subscriber = tracing_subscriber::fmt().finish();
    tracing::subscriber::set_global_default(subscriber)?;

    let config = envy::from_env::<Configuration>().expect("Missing environment variables");

    let local_pool = PgPoolOptions::new()
        .max_connections(config.local_pool_connections)
        .connect(&config.database_url)
        .await?;

    let indexer_pool = PgPoolOptions::new()
        .max_connections(config.indexer_pool_connections)
        .connect(&config.indexer_url)
        .await?;

    let rpc_client = JsonRpcClient::connect(&config.rpc_url);

    let connections = Arc::new(Connections {
        local_pool,
        indexer_pool,
        rpc_client,
    });

    info!("Requesting accounts");

    let accounts = get_recent_actors(
        &connections.indexer_pool,
        chrono::Utc::now()
            .sub(Duration::minutes(10))
            .timestamp_nanos()
            .try_into()
            .unwrap(),
    )
    .await
    .unwrap();

    info!("Checking {} accounts", accounts.len());

    let (account_send, account_recv) = broadcast::channel(config.account_threads);
    local::start_local_updater(connections.clone(), account_recv);

    let mut badge_registry = BadgeRegistry::new(connections.clone(), config.account_threads);
    badge_registry.register(&*transfer::BADGE_IDS, transfer::run);
    let badge_registry = Arc::new(badge_registry);

    let simultaneous_accounts = Arc::new(Semaphore::new(config.account_threads));

    let mut join_handles = Vec::new();

    let num_completed = Arc::new(Mutex::new(0));
    let total = accounts.len();

    for account in accounts {
        let simultaneous_accounts = Arc::clone(&simultaneous_accounts);
        let permit = simultaneous_accounts.acquire_owned().await;

        let account_id: AccountId = match account.parse() {
            Ok(a) => a,
            Err(..) => continue,
        };
        let account_send = account_send.clone();
        let connections = Arc::clone(&connections);
        let badge_registry = Arc::clone(&badge_registry);
        let num_completed = num_completed.clone();

        let join_handle = tokio::spawn(async move {
            let (account_record, existing_badges) = join!(
                query_account(&connections.local_pool, &account_id),
                get_badges_for_account(&connections.local_pool, &account_id),
            );

            let is_update_allowed = account_record
                .ok()
                .and_then(|r| r.next_update_allowed_at())
                .map(|cutoff| chrono::Utc::now() >= cutoff)
                .unwrap_or(true);

            if !is_update_allowed {
                info!("Disallowing update for {account_id}");
            } else {
                if let Err(e) = account_send.send(account_id.clone()) {
                    error!("Error sending to local updater: {e:?}");
                }

                let awarded_badges = badge_registry
                    .queue_account(
                        account_id.clone(),
                        existing_badges.unwrap_or_else(|_| HashSet::new()),
                    )
                    .await;

                for badge_id in awarded_badges {
                    match add_badge_for_account(&connections.local_pool, &account_id, &badge_id)
                        .await
                    {
                        Ok(_) => info!("Added badge {badge_id} to {account_id}"),
                        Err(e) => error!("Failed to add badge {badge_id} to {account_id}: {e:?}"),
                    }
                }
            }

            drop(permit);

            let mut num_completed = num_completed.lock().await;
            *num_completed += 1;
            info!("Completed {num_completed} / {total}\t{account_id}");
        });

        join_handles.push(join_handle);
    }

    join_all(join_handles).await;

    Ok(())
}
