const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select distinct receiver_account_id
    from receipts
    where predecessor_account_id = ${params.account_id}
  `;
};
