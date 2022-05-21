use futures::{StreamExt, TryFutureExt, TryStreamExt};
use sqlx::PgPool;

pub async fn get_recent_actors(
    pool: &PgPool,
    timestamp_nanoseconds: u64,
) -> Result<Vec<String>, sqlx::Error> {
    #[derive(sqlx::FromRow)]
    struct AccountId {
        pub account_id: String,
    }

    sqlx::query_as::<_, AccountId>(
        r#"--sql
select distinct predecessor_account_id as account_id
    from receipts
    where included_in_block_timestamp > $1
        and length(predecessor_account_id) != 64
        and predecessor_account_id like '%.%'
union
select distinct receiver_account_id as account_id
    from receipts
    where included_in_block_timestamp > $1
        and length(receiver_account_id) != 64
        and receiver_account_id like '%.%'
"#,
    )
    .bind(timestamp_nanoseconds as i64) // for some reason Encode is not implemented for u64 on Postgres
    .fetch(pool)
    .map(|i| i.map(|a| a.account_id))
    .try_collect::<Vec<_>>()
    .await
}

pub async fn calculate_account_score(pool: &PgPool, account_id: &str) -> Result<u32, sqlx::Error> {
    #[derive(sqlx::FromRow)]
    struct WithResult {
        pub result: i64,
    }

    sqlx::query_as::<_, WithResult>(
        r#"--sql
select coalesce(sum(
    case
    when action_kind = 'TRANSFER'
        and signer_account_id = $1
        then 10
    when action_kind = 'TRANSFER'
        and tx.receiver_account_id = $1
        then 2
    when action_kind = 'CREATE_ACCOUNT'
        and signer_account_id = $1
        then 50
    when action_kind = 'FUNCTION_CALL'
        and signer_account_id = $1
        then 10
    when action_kind = 'DEPLOY_CONTRACT'
        and signer_account_id = $1
        then 100
    else 0
    end
), 0) as result
from (
    select *
    from transactions
    where (transactions.signer_account_id = $1
    or transactions.receiver_account_id = $1)
) tx
inner join receipts on tx.converted_into_receipt_id = receipts.receipt_id
left outer join transaction_actions on tx.transaction_hash = transaction_actions.transaction_hash
"#,
    )
    .bind(account_id)
    .fetch_one(pool)
    .map_ok(|a| a.result as u32)
    .await
}
