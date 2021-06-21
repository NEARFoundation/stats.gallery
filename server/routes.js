const distinctCallersSql = require('./queries/distinct-callers.sql');
const distinctReceiversSql = require('./queries/distinct-receivers.sql');
const totalReceivedSql = require('./queries/total-received.sql');
const totalSentSql = require('./queries/total-sent.sql');

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
];
