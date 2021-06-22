const { sql } = require('slonik');

module.exports = params => {
  return sql`
    select *
    from access_keys
    where account_id = ${params.account_id}
  `;
};
