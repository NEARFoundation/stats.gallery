const { sql } = require('slonik');

module.exports = () => {
  return sql`
    select receipt_receiver_account_id as account_id,
      receipt_included_in_block_timestamp as block_timestamp
    from
      (select receipt_receiver_account_id,
          receipt_predecessor_account_id,
          receipt_included_in_block_timestamp
        from action_receipt_actions ara
        where action_kind = 'CREATE_ACCOUNT'
        order by receipt_included_in_block_timestamp desc
        limit 1000) create_account_actions
    where receipt_predecessor_account_id = 'near'
    limit 20
  `;
};
