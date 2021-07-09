const { sql } = require('slonik');

module.exports = params => {
  const conditions = [
    sql`(r.predecessor_account_id = ${params.account_id} or r.receiver_account_id = ${params.account_id})`,
    sql`r.receipt_kind = 'ACTION'`,
  ];

  if (params.after_block_timestamp > 0) {
    conditions.push(
      sql`r.included_in_block_timestamp >= ${params.after_block_timestamp}`,
    );
  }

  if (params.before_block_timestamp > 0) {
    conditions.push(
      sql`r.included_in_block_timestamp <= ${params.before_block_timestamp}`,
    );
  }

  return sql`
    select
      r.receipt_id,
      ara.index_in_action_receipt,
      r.originated_from_transaction_hash as transaction_hash,
      ara.action_kind,
      r.included_in_block_hash as block_hash,
      r.included_in_block_timestamp as block_timestamp,
      r.predecessor_account_id,
      r.receiver_account_id
    from receipts r
    left outer join action_receipt_actions ara on ara.receipt_id = r.receipt_id
    where ${sql.join(conditions, sql` and `)}
    order by r.included_in_block_timestamp desc
    limit 2000
  `;
};
