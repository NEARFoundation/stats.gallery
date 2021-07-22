const { sql } = require('slonik');

module.exports = () => {
  return sql`
    select
      percentile_disc(0.9999) within group (order by sent_count) as p9999,
      percentile_disc(0.999) within group (order by sent_count) as p999,
      percentile_disc(0.995) within group (order by sent_count) as p995,
      percentile_disc(0.99) within group (order by sent_count) as p99,
      percentile_disc(0.98) within group (order by sent_count) as p98,
      percentile_disc(0.97) within group (order by sent_count) as p97,
      percentile_disc(0.96) within group (order by sent_count) as p96,
      percentile_disc(0.95) within group (order by sent_count) as p95,
      percentile_disc(0.94) within group (order by sent_count) as p94,
      percentile_disc(0.93) within group (order by sent_count) as p93,
      percentile_disc(0.92) within group (order by sent_count) as p92,
      percentile_disc(0.91) within group (order by sent_count) as p91,
      percentile_disc(0.90) within group (order by sent_count) as p90,
      percentile_disc(0.85) within group (order by sent_count) as p85,
      percentile_disc(0.80) within group (order by sent_count) as p80,
      percentile_disc(0.70) within group (order by sent_count) as p70,
      percentile_disc(0.60) within group (order by sent_count) as p60,
      percentile_disc(0.50) within group (order by sent_count) as p50
    from
      (select signer_account_id,
          count(*) as sent_count
        from transactions
        group by signer_account_id
        order by sent_count) s
  `;
};
