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

    if score.is_err() || balance.is_err() {
        println!("Error calculating score or balance for {account_id}: {:?}\n{:?}", &score, &balance);
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
