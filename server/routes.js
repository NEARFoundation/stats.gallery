const accessKeysSql = require('./queries/access-keys.sql');
const accountActivityDistributionSql = require('./queries/account-activity-distribution.sql');
const accountCreationSql = require('./queries/account-creation.sql');
const accountRelationStrengthSql = require('./queries/account-relation-strength.sql');
const actionsSql = require('./queries/actions.sql');
const allAccountsSql = require('./queries/all-accounts.sql');
const badgeDeploySql = require('./queries/badge-deploy.sql');
const badgeNftSql = require('./queries/badge-nft.sql');
const badgeStakeSql = require('./queries/badge-stake.sql');
const badgeTransferSql = require('./queries/badge-transfer.sql');
const distinctSendersSql = require('./queries/distinct-senders.sql');
const distinctReceiversSql = require('./queries/distinct-receivers.sql');
const gasSpentSql = require('./queries/gas-spent.sql');
const gasTokensSpentSql = require('./queries/gas-tokens-spent.sql');
const newAccountsCountSql = require('./queries/new-accounts-count.sql');
const newAccountsListSql = require('./queries/new-accounts-list.sql');
const receivedTransactionCountSql = require('./queries/received-transaction-count.sql');
const recentTransactionActionsSql = require('./queries/recent-transaction-actions.sql');
const scoreSql = require('./queries/score.sql');
const sentTransactionCountSql = require('./queries/sent-transaction-count.sql');
const topAccountsSql = require('./queries/top-accounts.sql');
const totalReceivedSql = require('./queries/total-received.sql');
const totalSentSql = require('./queries/total-sent.sql');

const SECOND = 1000,
  MINUTE = 60 * SECOND,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR;

module.exports = [
  {
    path: 'access-keys',
    query: accessKeysSql,
  },
  {
    path: 'account-activity-distribution',
    query: accountActivityDistributionSql,
    poll: 3 * DAY,
  },
  {
    path: 'account-creation',
    query: accountCreationSql,
  },
  {
    path: 'account-relation-strength',
    query: accountRelationStrengthSql,
  },
  {
    path: 'actions',
    query: actionsSql,
  },
  {
    path: 'all-accounts',
    query: allAccountsSql,
    poll: HOUR,
  },
  {
    path: 'badge-deploy',
    query: badgeDeploySql,
  },
  {
    path: 'badge-nft',
    query: badgeNftSql,
  },
  {
    path: 'badge-stake',
    query: badgeStakeSql,
  },
  {
    path: 'badge-transfer',
    query: badgeTransferSql,
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
    path: 'new-accounts-count',
    query: newAccountsCountSql,
    poll: HOUR,
  },
  {
    path: 'new-accounts-list',
    query: newAccountsListSql,
    poll: 10 * MINUTE,
  },
  {
    path: 'received-transaction-count',
    query: receivedTransactionCountSql,
  },
  {
    path: 'recent-transaction-actions',
    query: recentTransactionActionsSql,
  },
  {
    path: 'score',
    query: scoreSql,
  },
  {
    path: 'sent-transaction-count',
    query: sentTransactionCountSql,
  },
  {
    path: 'top-accounts',
    query: topAccountsSql,
    poll: 6 * HOUR,
  },
  {
    path: 'total-received',
    query: totalReceivedSql,
  },
  {
    path: 'total-sent',
    query: totalSentSql,
  },
];
