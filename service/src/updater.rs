use near_jsonrpc_client::{errors::JsonRpcError, methods::query::RpcQueryError, JsonRpcClient};
use near_primitives::types::AccountId;
use num_traits::FromPrimitive;
use sqlx::{types::Decimal, PgPool};
use tokio::join;

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

pub async fn update_account(
    local_pool: &PgPool,
    indexer_pool: &PgPool,
    jsonrpc_client: &JsonRpcClient,
    account_id: AccountId,
) -> Result<(), UpdateAccountError> {
    let (score, balance) = join!(
        calculate_account_score(indexer_pool, &account_id),
        get_account_balance(jsonrpc_client, account_id.clone())
    );

    let score = score.map_err(|e| UpdateAccountError::ScoreError(e))?;
    let balance = Decimal::from_u128(balance?);

    sqlx::query!(
        "
INSERT INTO account(id, balance, score)
    VALUES ($1, $2, $3)
    ON CONFLICT (id) DO
        UPDATE SET balance = EXCLUDED.balance, score = EXCLUDED.score
",
        account_id.to_string(),
        balance,
        score as i64
    )
    .execute(local_pool)
    .await?;

    Ok(())
}
