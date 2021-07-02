import { Network } from '@/services/near/networks';

export function isString(x: unknown): x is string {
  return x + '' === x;
}

export function isNumber(x: unknown): x is number {
  return +(x as number) === x;
}

export function isBoolean(x: unknown): x is boolean {
  return !!x === x;
}

export function isNetwork(x: unknown): x is Network {
  return x === Network.MAINNET || x === Network.TESTNET;
}
