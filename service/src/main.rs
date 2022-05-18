use dotenv::dotenv;

use near_jsonrpc_client::JsonRpcClient;
use serde::Deserialize;
use sqlx::{migrate, postgres::PgPoolOptions};

use crate::badge::{BadgeRegistry, transfer};

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

    let mut badge_registry = BadgeRegistry::new();

    // for badge_id in transfer::BADGE_IDS {
    //     badge_registry.register(badge_id, transfer::check_account);
    // }


    // updater::update_account(
    //     &local_pool,
    //     &indexer_pool,
    //     &jsonrpc_client,
    //     "hatchet.near".parse().unwrap(),
    // ).await.unwrap();

    // let result = indexer::get_recent_actors(&indexer_pool, 1652741757312000000).await?;

    // println!("{}", &result.len());

    // let mut result = sqlx::query("select * from accounts limit 10").fetch(&pool);

    // while let Some(row) = result.try_next().await? {
    //     let account_id: Result<String, _> = row.try_get("account_id");
    //     if let Ok(account_id) = account_id {
    //         println!("Account ID: {account_id}");
    //     }
    // }

    Ok(())
}
