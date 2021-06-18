import Big from 'big.js';

const yocto = new Big('1e+24');

export function toNear(value: string | number | Big): number {
  const bn = new Big(value);
  return bn.div(yocto).toNumber();
}

export const nearCurrencySymbol = String.fromCharCode(9411); // Ⓝ
