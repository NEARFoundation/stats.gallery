export const enum Timeframe {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all',
}

export function isTimeframe(x: unknown): x is Timeframe {
  return [
    Timeframe.DAY,
    Timeframe.WEEK,
    Timeframe.MONTH,
    Timeframe.YEAR,
    Timeframe.ALL,
  ].includes(x as Timeframe);
}
