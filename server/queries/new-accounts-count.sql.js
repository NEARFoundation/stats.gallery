const { sql } = require('slonik');

module.exports = () => {
  return sql`
    select count(receipt_receiver_account_id) as new_accounts, block_date
    from (
      select
        receipt_receiver_account_id,
        to_timestamp((receipt_included_in_block_timestamp)/1000000000)::date as block_date
      from action_receipt_actions
      where action_kind = 'CREATE_ACCOUNT'
      order by block_date desc
    ) create_account_receipts
    group by block_date
    order by block_date desc
    limit 10
  `;
};
