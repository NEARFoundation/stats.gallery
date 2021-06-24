const { sql } = require('slonik');

module.exports = params => {
  const conditions = [
    sql`transactions.signer_account_id = ${params.account_id}`,
  ];

  if (params.after_block_timestamp > 0) {
    conditions.push(
      sql`transactions.block_timestamp >= ${params.after_block_timestamp}`,
    );
  }

  if (params.before_block_timestamp > 0) {
    conditions.push(
      sql`transactions.block_timestamp <= ${params.before_block_timestamp}`,
    );
  }

  return sql`
    select
      transaction_actions.*,
      block_timestamp,
      signer_account_id,
      receiver_account_id
    from transactions
    left outer join transaction_actions
      on transactions.transaction_hash = transaction_actions.transaction_hash
    where
      ${sql.join(conditions, sql` and `)}
    order by transactions.block_timestamp desc
    limit 20
  `;
};
