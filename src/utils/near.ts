import { NearClient } from '@/services/near/NearClient';
import { Network } from '@/services/near/networks';
import Big from 'big.js';
import { DateTime } from 'luxon';
import { inject, Ref } from 'vue';

const yocto = new Big('1e+24');

export function toNear(value?: string | number | Big): Big {
  const bn = new Big(value ?? 0);
  return bn.div(yocto);
}

export const nearSymbol = String.fromCharCode(9411); // Ⓝ

export function nearContext(): {
  account: Ref<string>;
  network: Ref<Network>;
  client: NearClient;
} {
  // TODO: Fallback?
  // eslint-disable-next-line
  const account = inject<Ref<string>>('account')!;
  // eslint-disable-next-line
  const network = inject<Ref<Network>>('network')!;
  // eslint-disable-next-line
  const client = inject<NearClient>('near')!;

  return {
    account,
    network,
    client,
  };
}

export function nearTimestampToLocaleString(
  timestamp: number,
  format?: Intl.DateTimeFormatOptions,
): string {
  return DateTime.fromMillis(timestamp / 1000000).toLocaleString(format);
}

export function nearTimestampToISO(timestamp: number): string {
  return DateTime.fromMillis(timestamp / 1000000).toISO();
}
