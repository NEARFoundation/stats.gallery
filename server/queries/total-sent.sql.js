const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select sum((args->>'deposit')::numeric)::text as result
    from transaction_actions
      inner join transactions on transaction_actions.transaction_hash = transactions.transaction_hash
    where transactions.signer_account_id = ${params.account_id}
      and transaction_actions.action_kind = 'TRANSFER'
  `;
};
