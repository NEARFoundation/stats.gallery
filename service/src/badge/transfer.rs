use std::sync::Arc;

use crate::badge::BadgeCheckResult;

use futures::FutureExt;
use near_primitives::types::AccountId;
use sqlx::PgPool;
use thiserror::Error;
use tokio::sync::{broadcast, Semaphore};

use super::Connections;

pub static TRANSFER_1: &'static str = "b36c3dd2-b8b0-4098-b227-63290f009668";
pub static TRANSFER_10: &'static str = "609b2017-9534-4737-b86b-6ee4897fc4f9";
pub static TRANSFER_100: &'static str = "64ce9af9-52ac-49dc-96fd-031b4fa2efad";
pub static BADGE_IDS: &'static [&'static str] = &[TRANSFER_1, TRANSFER_10, TRANSFER_100];

#[derive(Error, Debug)]
enum TransferBadgeError {
    #[error("Query failure: {0}")]
    QueryFailure(#[from] sqlx::Error),
}

async fn perform_query(
    indexer_pool: PgPool,
    account_id: AccountId,
) -> Result<BadgeCheckResult, TransferBadgeError> {
    #[derive(sqlx::FromRow)]
    struct WithResult {
        pub result: i64,
    }

    sqlx::query_as::<_, WithResult>(
        r#"
            select count(*) as result
                from action_receipt_actions
                where action_kind = 'TRANSFER'
                    and receipt_predecessor_account_id = $1
              "#,
    )
    .bind(account_id.to_string())
    .fetch_one(&indexer_pool)
    .map(|result| {
        result
            .map(|r| {
                let total = r.result;
                let awarded = if total >= 100 {
                    BADGE_IDS
                } else if total >= 10 {
                    &BADGE_IDS[..2]
                } else if total >= 1 {
                    &BADGE_IDS[..1]
                } else {
                    &[]
                }
                .to_vec();

                BadgeCheckResult {
                    account_id,
                    awarded: awarded.into_iter().collect(),
                    checked: BADGE_IDS.to_vec().into_iter().collect(),
                }
            })
            .map_err(|e| TransferBadgeError::from(e))
    })
    .await
}

pub fn start(
    semaphore: Semaphore,
    connections: &Connections,
    mut input: broadcast::Receiver<AccountId>,
    output: broadcast::Sender<BadgeCheckResult>,
) {
    let indexer_pool = connections.indexer_pool.clone();

    tokio::spawn(async move {
        let semaphore = Arc::new(semaphore);

        while let Ok(account_id) = input.recv().await {
            let indexer_pool = indexer_pool.clone();
            let output = output.clone();
            let semaphore = semaphore.clone();

            tokio::spawn(async move {
                let permit = semaphore.acquire().await.unwrap();
                println!("Acquired for {account_id}");
                let result = perform_query(indexer_pool, account_id.clone()).await;
                println!("Finished {account_id}");
                drop(permit);
                match result {
                    Ok(result) => {
                        output.send(result).unwrap(); // TODO: Log instead of unwrap
                    }
                    Err(e) => println!("{e:?}"),
                }
            });
        }
    });
}
