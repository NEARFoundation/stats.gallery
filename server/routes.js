const accessKeysSql = require('./queries/access-keys.sql');
const actionsSql = require('./queries/actions.sql');
const distinctSendersSql = require('./queries/distinct-senders.sql');
const distinctReceiversSql = require('./queries/distinct-receivers.sql');
const gasSpentSql = require('./queries/gas-spent.sql');
const gasTokensSpentSql = require('./queries/gas-tokens-spent.sql');
const recentTransactionActionsSql = require('./queries/recent-transaction-actions.sql');
const totalReceivedSql = require('./queries/total-received.sql');
const totalSentSql = require('./queries/total-sent.sql');
const transactionCountSql = require('./queries/transaction-count.sql');

module.exports = [
  {
    path: 'access-keys',
    query: accessKeysSql,
  },
  {
    path: 'actions',
    query: actionsSql,
  },
  {
    path: 'distinct-receivers',
    query: distinctReceiversSql,
  },
  {
    path: 'distinct-senders',
    query: distinctSendersSql,
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
    path: 'recent-transaction-actions',
    query: recentTransactionActionsSql,
  },
  {
    path: 'total-received',
    query: totalReceivedSql,
  },
  {
    path: 'total-sent',
    query: totalSentSql,
  },
  {
    path: 'transaction-count',
    query: transactionCountSql,
  },
];
