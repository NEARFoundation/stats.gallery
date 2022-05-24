use std::{collections::HashSet, str::FromStr, sync::Arc};

use chrono::{Duration, NaiveDateTime, TimeZone};
use futures::{FutureExt, StreamExt, TryFutureExt, TryStreamExt};
use near_jsonrpc_client::{errors::JsonRpcError, methods::query::RpcQueryError};
use near_primitives::types::AccountId;
use num_traits::FromPrimitive;
use sqlx::{
    types::{Decimal, Uuid},
    FromRow, PgPool,
};
use tokio::{
    join,
    sync::{broadcast, Semaphore},
};

/// Minimum amount of time between account updates
const ACCOUNT_UPDATE_COOLDOWN_MINUTES: i64 = 60 * 6;
/// Doubles every failure
const ACCOUNT_UPDATE_FAILURE_PENALTY_COEFFICIENT_MINUTES: i64 = 60 * 12;

use crate::{connections::Connections, indexer::calculate_account_score, rpc::get_account_balance};

use thiserror::Error;

#[derive(Error, Debug)]
pub enum UpdateAccountError {
    #[error("Error calculating score: {0}")]
    ScoreError(sqlx::Error),
    #[error("Error retrieving balance: {0}")]
    BalanceError(#[from] JsonRpcError<RpcQueryError>),
    #[error("Error running account update query: {0}")]
    InsertQueryError(#[from] sqlx::Error),
}

#[derive(FromRow)]
pub struct AccountRecordDb {
    pub id: String,
    pub balance: Option<Decimal>,
    pub score: Option<i32>,
    pub modified: Option<NaiveDateTime>,
    pub consecutive_errors: Option<i16>,
}

pub struct AccountRecord {
    pub id: AccountId,
    pub balance: Option<u128>,
    pub score: Option<u32>,
    pub modified: Option<chrono::DateTime<chrono::Utc>>,
    pub consecutive_errors: u16,
}

impl AccountRecord {
    pub fn next_update_allowed_at(&self) -> Option<chrono::DateTime<chrono::Utc>> {
        self.modified.map(|m| {
            m + (Duration::minutes(ACCOUNT_UPDATE_COOLDOWN_MINUTES))
                + (Duration::minutes(ACCOUNT_UPDATE_FAILURE_PENALTY_COEFFICIENT_MINUTES)
                    * ((1 << self.consecutive_errors) - 1))
        })
    }
}

impl From<AccountRecordDb> for AccountRecord {
    fn from(record: AccountRecordDb) -> Self {
        Self {
            id: record.id.parse().unwrap_or(
                AccountId::from_str(
                    "0000000000000000000000000000000000000000000000000000000000000000",
                )
                .unwrap(),
            ),
            balance: record.balance.and_then(|b| u128::try_from(b).ok()),
            score: record.score.map(|s| s as u32),
            modified: record.modified.map(|m| chrono::Utc.from_utc_datetime(&m)),
            consecutive_errors: record.consecutive_errors.unwrap_or(0) as u16,
        }
    }
}

pub async fn query_account(
    local_pool: &PgPool,
    account_id: &AccountId,
) -> Result<AccountRecord, sqlx::Error> {
    sqlx::query_as!(
        AccountRecordDb,
        r#"--sql
select id, balance, score, modified, consecutive_errors
    from account
    where id = $1
    "#,
        account_id.to_string()
    )
    .fetch_one(local_pool)
    .map(|a| a.map(AccountRecord::from))
    .await
}

#[derive(FromRow)]
pub struct AccountBadgeRecordDb {
    pub badge_id: Uuid,
}

pub async fn add_badge_for_account(
    local_pool: &PgPool,
    account_id: &AccountId,
    badge_id: &Uuid,
) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"--sql
insert into account_badge(account_id, badge_id)
    values ($1, $2)
    on conflict (account_id, badge_id) do nothing
"#,
        account_id.to_string(),
        &badge_id
    )
    .execute(local_pool)
    .map_ok(|_| ())
    .await
}

pub async fn get_badges_for_account(
    local_pool: &PgPool,
    account_id: &AccountId,
) -> Result<HashSet<Uuid>, sqlx::Error> {
    sqlx::query_as!(
        AccountBadgeRecordDb,
        r#"--sql
select badge_id
    from account_badge
    where account_id = $1
"#,
        account_id.to_string()
    )
    .fetch(local_pool)
    .map(|b| b.map(|a| a.badge_id))
    .try_collect::<HashSet<Uuid>>()
    .await
}

pub async fn update_account(
    connections: &Connections,
    account_id: &AccountId,
) -> Result<(), UpdateAccountError> {
    let (score, balance) = join!(
        calculate_account_score(&connections.indexer_pool, &account_id),
        get_account_balance(&connections.rpc_client, &account_id)
    );

    if score.is_err() || balance.is_err() {
        println!(
            "Error calculating score or balance for {account_id}: {:?}\n{:?}",
            &score, &balance
        );
        let err_query_result = sqlx::query!(
            r#"--sql
INSERT INTO account(id, consecutive_errors)
    VALUES ($1, 1)
    ON CONFLICT (id) DO
        UPDATE SET consecutive_errors = account.consecutive_errors + 1
        "#,
            account_id.to_string()
        )
        .execute(&connections.local_pool)
        .await;

        match err_query_result {
            Ok(..) => println!("Successfully updated consecutive_errors"),
            Err(e) => println!("Failed to update consecutive_errors: {e:?}"),
        };
    }

    let score = score.map_err(|e| UpdateAccountError::ScoreError(e))?;
    let balance = Decimal::from_u128(balance?);

    sqlx::query!(
        "--sql
INSERT INTO account(id, balance, score, consecutive_errors)
    VALUES ($1, $2, $3, 0)
    ON CONFLICT (id) DO
        UPDATE SET
            balance = EXCLUDED.balance,
            score = EXCLUDED.score,
            consecutive_errors = 0
",
        account_id.to_string(),
        balance,
        score as i64
    )
    .execute(&connections.local_pool)
    .await?;

    Ok(())
}

pub fn start_local_updater(
    semaphore: Arc<Semaphore>,
    connections: Arc<Connections>,
    mut input: broadcast::Receiver<AccountId>,
) {
    tokio::spawn(async move {
        while let Ok(account_id) = input.recv().await {
            let connections = connections.clone();
            let semaphore = semaphore.clone();

            tokio::spawn(async move {
                let permit = semaphore.acquire().await.unwrap();
                println!("Acquired for {account_id}");
                let result = update_account(&connections, &account_id).await;
                println!("Finished {account_id}");
                drop(permit);

                if let Err(e) = result {
                    println!("Error updating account {account_id}: {e:?}");
                }
            });
        }
    });
}
