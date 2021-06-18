import BN from 'bn.js';

const yocto = new BN(1e24);

export function toNear(value: string | number | BN): number {
  const bn = new BN(value);
  return bn.div(yocto).toNumber();
}
