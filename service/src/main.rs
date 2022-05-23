use std::{collections::HashSet, ops::Sub};

use chrono::Duration;
use dotenv::dotenv;

use near_jsonrpc_client::JsonRpcClient;
use near_primitives::types::AccountId;
use serde::Deserialize;
use sqlx::{migrate, postgres::PgPoolOptions};
use tokio::sync::{broadcast, Semaphore};

use crate::{
    badge::{
        transfer::{self, TRANSFER_1},
        BadgeRegistry,
    },
    connections::Connections,
    indexer::get_recent_actors,
    local::query_account,
};

#[derive(Deserialize)]
struct Configuration {
    #[allow(unused)] // env var read by default by sqlx
    pub database_url: String,
    pub indexer_url: String,
    pub rpc_url: String,
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

    let config = envy::from_env::<Configuration>().expect("Missing environment variables");

    let local_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.database_url)
        .await?;

    let indexer_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&config.indexer_url)
        .await?;

    let jsonrpc_client = JsonRpcClient::connect(&config.rpc_url);

    println!("Requesting accounts");

    let accounts = get_recent_actors(
        &indexer_pool,
        chrono::Utc::now()
            .sub(Duration::minutes(10))
            .timestamp_nanos()
            .try_into()
            .unwrap(),
    )
    .await
    .unwrap();

    println!("Checking {} accounts", accounts.len());

    println!("Creating badge registry");

    let connections = Connections {
        local_pool: local_pool.clone(),
        indexer_pool: indexer_pool.clone(),
        rpc_client: jsonrpc_client.clone(),
    };

    let mut badge_registry = BadgeRegistry::new(connections.clone());

    let mut r = badge_registry.subscribe();

    let target = accounts.len();

    let badge_handle = tokio::spawn(async move {
        println!("Listening for badge results");
        let mut done = 0;
        while let Ok(result) = r.recv().await {
            done += 1;
            let account_id = result.account_id;
            println!("{done} / {target} - {account_id}");
            // TODO: write badges back to local db
        }
    });

    let local_semaphore = Semaphore::new(5);
    let (account_send, account_recv) = broadcast::channel(16);
    local::start_local_updater(local_semaphore, connections.clone(), account_recv);

    badge_registry.register(&*transfer::BADGE_IDS, transfer::run);

    let now = chrono::Utc::now();

    for account in accounts {
        let account_id: AccountId = account.parse().unwrap();
        let account_record = query_account(&local_pool, &account_id).await;
        let is_update_allowed = account_record
            .ok()
            .and_then(|r| r.next_update_allowed_at())
            .map(|cutoff| now >= cutoff)
            .unwrap_or(true);

        if !is_update_allowed {
            println!("Disallowing update for {account_id}");
            continue;
        }

        if let Err(e) = account_send.send(account_id.clone()) {
            println!("Error sending to local updater: {e:?}");
        }

        badge_registry
            .queue_account(account_id.clone(), HashSet::new())
            .await;
    }

    println!("Waiting.");

    badge_handle.await.unwrap();

    Ok(())
}
