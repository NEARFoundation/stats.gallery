const { sql } = require('slonik');

module.exports = params => {
  const conditions = [sql`receiver_account_id = ${params.account_id}`];

  if (params.after_block_timestamp > 0) {
    conditions.push(sql`block_timestamp >= ${params.after_block_timestamp}`);
  }

  if (params.before_block_timestamp > 0) {
    conditions.push(sql`transactions.block_timestamp <= ${params.before_block_timestamp}`);
  }

  return sql`
    select count(*) as result
    from transactions
    where ${sql.join(conditions, sql` and `)}
  `;
};
