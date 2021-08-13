const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select count(*) as result
    where exists(
      select *
      from transactions
      where signer_account_id = ${params.account_id}
        and receiver_account_id like '%.poolv1.near'
    )
  `;
};
