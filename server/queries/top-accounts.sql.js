const { sql } = require('slonik');

module.exports = () => {
  return sql`
    select signer_account_id,
      sent_count,
      received_count
    from
      (select signer_account_id,
          count(*) as sent_count
        from transactions
        group by signer_account_id
        order by sent_count desc
        limit 20) s
    inner join
      (select receiver_account_id,
          count(*) as received_count
        from transactions
        group by receiver_account_id) r on r.receiver_account_id = s.signer_account_id
    order by sent_count desc
  `;
};
