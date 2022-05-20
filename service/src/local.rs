use std::{ops::Add, str::FromStr};

use chrono::{Duration, NaiveDateTime, TimeZone};
use futures::FutureExt;
use near_jsonrpc_client::{errors::JsonRpcError, methods::query::RpcQueryError, JsonRpcClient};
use near_primitives::types::AccountId;
use num_traits::FromPrimitive;
use sqlx::{types::Decimal, FromRow, PgPool};
use tokio::join;

/// Minimum amount of time between account updates
const ACCOUNT_UPDATE_COOLDOWN_MINUTES: i64 = 60 * 6;
/// Doubles every failure
const ACCOUNT_UPDATE_FAILURE_PENALTY_COEFFICIENT_MINUTES: i64 = 60 * 12;

use crate::{indexer::calculate_account_score, rpc::get_account_balance};

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
        r#"
select id, balance, score, modified, consecutive_errors from account where id = $1
    "#,
        account_id.to_string()
    )
    .fetch_one(local_pool)
    .map(|a| a.map(AccountRecord::from))
    .await
}

pub async fn update_account(
    local_pool: &PgPool,
    indexer_pool: &PgPool,
    jsonrpc_client: &JsonRpcClient,
    account_id: &AccountId,
) -> Result<(), UpdateAccountError> {
    let (score, balance) = join!(
        calculate_account_score(indexer_pool, &account_id),
        get_account_balance(jsonrpc_client, &account_id)
    );

    if score.is_err() || balance.is_err() {
        println!(
            "Error calculating score or balance for {account_id}: {:?}\n{:?}",
            &score, &balance
        );
        let err_query_result = sqlx::query!(
            r#"
INSERT INTO account(id, consecutive_errors)
    VALUES ($1, 1)
    ON CONFLICT (id) DO
        UPDATE SET consecutive_errors = account.consecutive_errors + 1
        "#,
            account_id.to_string()
        )
        .execute(local_pool)
        .await;

        match err_query_result {
            Ok(..) => println!("Successfully updated consecutive_errors"),
            Err(e) => println!("Failed to update consecutive_errors: {e:?}"),
        };
    }

    let score = score.map_err(|e| UpdateAccountError::ScoreError(e))?;
    let balance = Decimal::from_u128(balance?);

    sqlx::query!(
        "
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
    .execute(local_pool)
    .await?;

    Ok(())
}
