import { usePromise } from '@/composables/usePromise';
import { IndexerClient } from '@/services/near/indexer/IndexerClient';
import { Network } from '@/services/near/indexer/networks';
import { Timeframe, timeframeToPastTimestamp } from '@/services/timeframe';
import { deref, OptionalRef } from '@/utils/deref';
import { isRef, Ref, WatchSource } from 'vue';

// De-duplicate requests within one second
const requestExpirationTimeout = 1000;
const requests = new Map<string, Promise<any>>();

function requestId(
  stat: string,
  {
    account,
    network,
    timeframe,
  }: {
    account: string;
    network: Network;
    timeframe: Timeframe;
  },
): string {
  return [stat, account, network, timeframe].map(s => btoa(s)).join('-');
}

export function useStat<T>(
  stat: string,
  defaultValue: T,
  {
    account,
    network,
    timeframe,
  }: {
    account: OptionalRef<string>;
    network: OptionalRef<Network>;
    timeframe: OptionalRef<Timeframe>;
  },
): {
  value: Ref<T>;
  isLoading: Ref<boolean>;
} {
  const f: () => Promise<T> = () => {
    const rid = requestId(stat, {
      account: deref(account),
      network: deref(network),
      timeframe: deref(timeframe),
    });
    // Check if we have already made the request (in the past `requestExpirationTimeout` ms)
    const savedRequest = requests.get(rid);

    if (savedRequest) {
      return savedRequest as Promise<T>;
    } else {
      // Actually make the request
      const request = IndexerClient.from(deref(network)).getSingle<T>(stat, {
        account: deref(account),
        after: timeframeToPastTimestamp(deref(timeframe)) * 1_000_000,
        before: Date.now() * 1_000_000,
      });

      // Save for the next `requestExpirationTimeout` ms
      requests.set(rid, request);
      setTimeout(() => {
        const get = requests.get(rid);
        // Only clear the same request
        if (get === request) {
          requests.delete(rid);
        }
      }, requestExpirationTimeout);

      return request;
    }
  };

  const { value, isLoading } = usePromise(
    [account, network, timeframe].filter(w => isRef(w)) as WatchSource[],
    f,
    defaultValue,
  );

  return { value, isLoading };
}
