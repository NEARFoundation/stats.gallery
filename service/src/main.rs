use std::{collections::HashSet, ops::Sub};

use chrono::Duration;
use dotenv::dotenv;

use near_jsonrpc_client::JsonRpcClient;
use near_primitives::types::AccountId;
use serde::Deserialize;
use sqlx::{migrate, postgres::PgPoolOptions};

use crate::{
    badge::{transfer, BadgeRegistry},
    indexer::get_recent_actors,
    updater::update_account,
};

#[derive(Deserialize)]
struct Configuration {
    #[allow(unused)] // env var read by default by sqlx
    pub database_url: String,
    pub indexer_url: String,
    pub rpc_url: String,
}

mod badge;
mod indexer;
mod rpc;
mod updater;

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
            .sub(Duration::minutes(5))
            .timestamp_nanos()
            .try_into()
            .unwrap(),
    )
    .await
    .unwrap();

    println!("Checking {} accounts", accounts.len());

    println!("Creating badge registry");

    let mut badge_registry = BadgeRegistry::new(indexer_pool.clone(), jsonrpc_client.clone());

    let mut r = badge_registry.subscribe();

    let target = accounts.len();

    let badge_handle = tokio::spawn(async move {
        println!("Listening for badge results");
        let mut done = 0;
        while let Ok(result) = r.recv().await {
            done += 1;
            let account_id = result.account_id;
            println!("{done} / {target} - {account_id}");
        }
    });

    badge_registry.register(transfer::BADGE_IDS, transfer::start);

    for account in accounts {
        let account_id: AccountId = account.parse().unwrap();
        badge_registry
            .queue_account(account_id.clone(), HashSet::new())
            .await;
        update_account(&local_pool, &indexer_pool, &jsonrpc_client, account_id)
            .await
            .unwrap();
    }

    println!("Waiting.");

    badge_handle.await.unwrap();

    Ok(())
}
