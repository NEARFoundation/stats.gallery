const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select distinct signer_account_id
    from transactions
    where receiver_account_id = ${params.account_id}
    limit 20
  `;
};
