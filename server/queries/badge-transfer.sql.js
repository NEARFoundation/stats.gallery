const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select count(*) as result
    from action_receipt_actions
    where action_kind = 'TRANSFER'
      and receipt_predecessor_account_id = ${params.account_id}
  `;
};
