import { DateTime } from 'luxon';

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

export function timeframeToPastTimestamp(t: Timeframe): number {
  if (t === Timeframe.ALL) {
    return 0;
  }

  const dayValues = {
    [Timeframe.DAY]: 1,
    [Timeframe.WEEK]: 7,
    [Timeframe.MONTH]: 30,
    [Timeframe.YEAR]: 365,
  };

  return DateTime.now().minus({ days: dayValues[t] }).toMillis();
}
