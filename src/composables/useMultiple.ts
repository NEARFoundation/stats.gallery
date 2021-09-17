import { usePromise } from '@/composables/usePromise';
import { IndexerClient } from '@/services/near/indexer/IndexerClient';
import { Network } from '@/services/near/indexer/networks';
import { Timeframe, timeframeToPastTimestamp } from '@/services/timeframe';
import { debounceRequest, requestId } from '@/utils/debounceRequest';
import { deref, OptionalRef } from '@/utils/deref';
import { isRef, ref, Ref, WatchSource } from 'vue';

export function useMultiple<T>(
  stat: string,
  {
    account = '',
    network,
    timeframe = Timeframe.ALL,
  }: {
    account?: OptionalRef<string>;
    network: OptionalRef<Network>;
    timeframe?: OptionalRef<Timeframe>;
  },
  defaultValue: T[] = [],
): {
  value: Ref<T[]>;
  isLoading: Ref<boolean>;
} {
  const f: () => Promise<T[]> = () => {
    const [_account, _network, _timeframe] = [
      deref(account),
      deref(network),
      deref(timeframe),
    ];

    const rid = requestId(stat, _account, _network, _timeframe);

    return debounceRequest(rid, () =>
      IndexerClient.from(_network).getMultiple<T>(stat, {
        account: _account,
        after: timeframeToPastTimestamp(_timeframe) * 1_000_000,
        before: Date.now() * 1_000_000,
      }),
    );
  };

  const { value, isLoading } = usePromise(
    [account, network, timeframe, ref('')].filter(w =>
      isRef(w),
    ) as WatchSource[],
    f,
    defaultValue,
  );

  return { value, isLoading };
}
