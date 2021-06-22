const { sql } = require('slonik');

module.exports = params => {
  const conditions = [sql`signer_account_id = ${params.account_id}`];

  if (params.since_block_timestamp > 0) {
    conditions.push(sql`block_timestamp >= ${params.since_block_timestamp}`);
  }

  return sql`
    select count(*) as transaction_count
    from transactions
    where ${sql.join(conditions, sql` and `)}
  `;
};
