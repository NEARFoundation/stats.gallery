const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select account_id,
      sum(quantity) as strength
    from
      (select count(*) as quantity,
          signer_account_id as account_id
        from transactions
        where receiver_account_id = ${params.account_id}
        group by signer_account_id
        union all select count(*) as quantity,
          receiver_account_id as account_id
        from transactions
        where signer_account_id = ${params.account_id}
        group by receiver_account_id) q
    group by account_id
    order by strength desc
    limit 10
  `;
};
