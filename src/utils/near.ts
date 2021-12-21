import Big from 'big.js';
import { DateTime } from 'luxon';

const yocto = new Big('1e+24');

export function toNear(value?: string | number | Big): Big {
  const bn = new Big(value ?? 0);
  return bn.div(yocto);
}

export const nearSymbol = String.fromCharCode(9411); // Ⓝ

export function nearTimestampToLocaleString(
  timestamp: number,
  format?: Intl.DateTimeFormatOptions,
): string {
  return DateTime.fromMillis(timestamp / 1000000).toLocaleString(format);
}

export function nearTimestampToISO(timestamp: number): string {
  return DateTime.fromMillis(timestamp / 1000000).toISO();
}

export function isContract(codeHash: string): boolean {
  return codeHash !== '11111111111111111111111111111111';
}
