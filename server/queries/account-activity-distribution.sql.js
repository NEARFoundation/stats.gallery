const { sql } = require('slonik');

module.exports = () => {
  return sql`
    select
      percentile_disc(0.9999) within group (order by sent_count) as ".9999",
      percentile_disc(0.999) within group (order by sent_count) as ".999",
      percentile_disc(0.995) within group (order by sent_count) as ".995",
      percentile_disc(0.99) within group (order by sent_count) as ".99",
      percentile_disc(0.98) within group (order by sent_count) as ".98",
      percentile_disc(0.97) within group (order by sent_count) as ".97",
      percentile_disc(0.96) within group (order by sent_count) as ".96",
      percentile_disc(0.95) within group (order by sent_count) as ".95",
      percentile_disc(0.94) within group (order by sent_count) as ".94",
      percentile_disc(0.93) within group (order by sent_count) as ".93",
      percentile_disc(0.92) within group (order by sent_count) as ".92",
      percentile_disc(0.91) within group (order by sent_count) as ".91",
      percentile_disc(0.90) within group (order by sent_count) as ".90",
      percentile_disc(0.85) within group (order by sent_count) as ".85",
      percentile_disc(0.80) within group (order by sent_count) as ".80",
      percentile_disc(0.70) within group (order by sent_count) as ".70",
      percentile_disc(0.60) within group (order by sent_count) as ".60",
      percentile_disc(0.50) within group (order by sent_count) as ".50",
      count(signer_account_id) as total
    from
      (select signer_account_id,
          count(*) as sent_count
        from transactions
        group by signer_account_id
        order by sent_count) s
  `;
};
