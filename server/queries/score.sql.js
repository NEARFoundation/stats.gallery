const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select sum(
      case
        when action_kind = 'TRANSFER'
          and signer_account_id = ${params.account_id} then 10
        when action_kind = 'TRANSFER'
          and tx.receiver_account_id = ${params.account_id} then 2
        when action_kind = 'CREATE_ACCOUNT'
          and signer_account_id = ${params.account_id} then 50
        when action_kind = 'FUNCTION_CALL'
          and signer_account_id = ${params.account_id} then 10
        when action_kind = 'DEPLOY_CONTRACT'
          and signer_account_id = ${params.account_id} then 100
        else 0
      end
    ) as result
    from (
      select *
      from transactions
      where (transactions.signer_account_id = ${params.account_id}
        or transactions.receiver_account_id = ${params.account_id})
      order by block_timestamp desc
    ) tx
    inner join receipts on tx.converted_into_receipt_id = receipts.receipt_id
    left outer join transaction_actions on tx.transaction_hash = transaction_actions.transaction_hash
    limit 2000
  `;
};
