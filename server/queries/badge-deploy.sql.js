const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select count(*) as result
    where exists(
      select *
      from action_receipt_actions
      where action_kind = 'DEPLOY_CONTRACT'
        and receipt_predecessor_account_id = ${params.account_id}
    )
  `;
};
