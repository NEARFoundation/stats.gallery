const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select receipt_included_in_block_timestamp as result
    from action_receipt_actions
    where action_kind = 'CREATE_ACCOUNT'
      and receipt_receiver_account_id = ${params.account_id}
    limit 1
  `;
};
