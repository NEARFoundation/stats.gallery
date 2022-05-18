use std::{collections::HashSet, pin::Pin, time::Duration};

use crate::badge::BadgeCheckResult;

use super::{Badge, BadgeStruct, BadgeTrait};
use async_trait::async_trait;
use futures::{future::BoxFuture, Future, FutureExt};
use near_jsonrpc_client::JsonRpcClient;
use near_primitives::types::AccountId;
use sqlx::{postgres::PgRow, PgPool};
use thiserror::Error;
use tokio::time::{sleep_until, Instant};

pub struct Transfer;

pub static TRANSFER_1: &'static str = "b36c3dd2-b8b0-4098-b227-63290f009668";
pub static TRANSFER_10: &'static str = "609b2017-9534-4737-b86b-6ee4897fc4f9";
pub static TRANSFER_100: &'static str = "64ce9af9-52ac-49dc-96fd-031b4fa2efad";
pub static BADGE_IDS: &'static [&'static str] = &[TRANSFER_1, TRANSFER_10, TRANSFER_100];

#[async_trait]
impl Badge for Transfer {
    fn badge_ids() -> &'static [&'static str] {
        BADGE_IDS
    }

    async fn check_account(
        indexer_pool: &PgPool,
        _: &JsonRpcClient,
        account_id: &AccountId,
    ) -> Vec<&'static str> {
        #[derive(sqlx::FromRow)]
        struct WithResult {
            pub result: i64,
        }

        let result = sqlx::query_as::<_, WithResult>(
            r#"
select count(*) as result
    from action_receipt_actions
    where action_kind = 'TRANSFER'
        and receipt_predecessor_account_id = $1
  "#,
        )
        .bind(account_id.to_string())
        .fetch_one(indexer_pool)
        .await;

        match result {
            Ok(result) => {
                let total = result.result;
                if total >= 100 {
                    BADGE_IDS.to_vec()
                } else if total >= 10 {
                    BADGE_IDS[..2].to_vec()
                } else if total >= 1 {
                    BADGE_IDS[..1].to_vec()
                } else {
                    vec![]
                }
            }
            _ => vec![],
        }
    }
}

#[derive(Error, Debug)]
enum TransferBadgeError {
    #[error("Query failure: {0}")]
    QueryFailure(#[from] sqlx::Error),
}

pub async fn check_account(
    indexer_pool: &PgPool,
    _: &JsonRpcClient,
    account_id: &AccountId,
) -> Result<BadgeCheckResult, impl std::error::Error> {
    #[derive(sqlx::FromRow)]
    struct WithResult {
        pub result: i64,
    }

    let result = sqlx::query_as::<_, WithResult>(
        r#"
select count(*) as result
    from action_receipt_actions
    where action_kind = 'TRANSFER'
        and receipt_predecessor_account_id = $1
  "#,
    )
    .bind(account_id.to_string())
    .fetch_one(indexer_pool)
    .await;

    result.map(|result| {
        let total = result.result;
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
            awarded: awarded.into_iter().collect(),
            checked: BADGE_IDS.to_vec().into_iter().collect(),
        }
    })
}

fn test() {
    // let x = BadgeStruct {
    //     checker: Box::new(|indexer_pool, _, account_id| async move {
    //         #[derive(sqlx::FromRow)]
    //         struct WithResult {
    //             pub result: i64,
    //         }

    //         sqlx::query_as::<_, WithResult>(
    //             r#"
    //         select count(*) as result
    //             from action_receipt_actions
    //             where action_kind = 'TRANSFER'
    //                 and receipt_predecessor_account_id = $1
    //           "#,
    //         )
    //         .bind(account_id.to_string())
    //         .fetch_one(indexer_pool)
    //         .map(|result| {
    //             result
    //                 .map(|r| {
    //                     let total = r.result;
    //                     let awarded = if total >= 100 {
    //                         BADGE_IDS
    //                     } else if total >= 10 {
    //                         &BADGE_IDS[..2]
    //                     } else if total >= 1 {
    //                         &BADGE_IDS[..1]
    //                     } else {
    //                         &[]
    //                     }
    //                     .to_vec();

    //                     BadgeCheckResult {
    //                         awarded: awarded.into_iter().collect(),
    //                         checked: BADGE_IDS.to_vec().into_iter().collect(),
    //                     }
    //                 })
    //                 .map_err(|e| TransferBadgeError::from(e))
    //         })
    //         .boxed()
    //         .shared()
    //         .await

    //         // result.map(|result| {
    //         //     let total = result.result;
    //         //     let awarded = if total >= 100 {
    //         //         BADGE_IDS
    //         //     } else if total >= 10 {
    //         //         &BADGE_IDS[..2]
    //         //     } else if total >= 1 {
    //         //         &BADGE_IDS[..1]
    //         //     } else {
    //         //         &[]
    //         //     }
    //         //     .to_vec();

    //         //     BadgeCheckResult {
    //         //         awarded: awarded.into_iter().collect(),
    //         //         checked: BADGE_IDS.to_vec().into_iter().collect(),
    //         //     }
    //         // })
    //     }),
    //     badges: HashSet::new(),
    // };

    let y = BadgeStruct {
        checker: Box::new(|_, _, _| async {
            Ok(BadgeCheckResult {
                awarded: HashSet::new(),
                checked: HashSet::new(),
            }) as Result<_, TransferBadgeError>
        }),
        badges: HashSet::new(),
    };

    // let t: Box<dyn BadgeTrait> = Box::new(x);

    // let x: Vec<Box<dyn BadgeTrait>> = vec![Box::new(x), Box::new(y)];
}

fn x(y: Box<dyn Future<Output = Result<Option<PgRow>, sqlx::Error>> + Sync>, z: Box<u128>) {
    let x: Box<dyn Sync> = Box::new(y);
}
