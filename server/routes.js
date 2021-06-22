const accessKeysSql = require('./queries/access-keys.sql');
const distinctCallersSql = require('./queries/distinct-callers.sql');
const distinctReceiversSql = require('./queries/distinct-receivers.sql');
const gasSpentSql = require('./queries/gas-spent.sql');
const gasTokensSpentSql = require('./queries/gas-tokens-spent.sql');
const totalReceivedSql = require('./queries/total-received.sql');
const totalSentSql = require('./queries/total-sent.sql');
const transactionCountSql = require('./queries/transaction-count.sql');

module.exports = [
  {
    path: 'total-sent',
    query: totalSentSql,
  },
  {
    path: 'total-received',
    query: totalReceivedSql,
  },
  {
    path: 'distinct-receivers',
    query: distinctReceiversSql,
  },
  {
    path: 'distinct-callers',
    query: distinctCallersSql,
  },
  {
    path: 'access-keys',
    query: accessKeysSql,
  },
  {
    path: 'gas-spent',
    query: gasSpentSql,
  },
  {
    path: 'gas-tokens-spent',
    query: gasTokensSpentSql,
  },
  {
    path: 'transaction-count',
    query: transactionCountSql,
  },
];
