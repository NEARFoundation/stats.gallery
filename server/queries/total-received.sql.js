const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select sum((args->>'deposit')::numeric)::text as total_received
    from transaction_actions
      inner join transactions on transaction_actions.transaction_hash = transactions.transaction_hash
    where transactions.receiver_account_id = ${params.account_id}
      and transaction_actions.action_kind = 'TRANSFER'
  `;
};
