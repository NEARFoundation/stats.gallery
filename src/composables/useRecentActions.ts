import { usePromise } from '@/composables/usePromise';
import { IndexerClient } from '@/services/near/indexer/IndexerClient';
import { Network } from '@/services/near/indexer/networks';
import { UnifiedTransactionAction } from '@/services/near/indexer/types';
import { Timeframe, timeframeToPastTimestamp } from '@/services/timeframe';
import { deref, OptionalRef } from '@/utils/deref';
import { isRef, Ref, WatchSource } from 'vue';

export function useRecentActions({
  account,
  network,
  timeframe,
}: {
  account: OptionalRef<string>;
  network: OptionalRef<Network>;
  timeframe: OptionalRef<Timeframe>;
}): {
  actions: Ref<UnifiedTransactionAction[]>;
  isLoading: Ref<boolean>;
} {
  const f = () =>
    IndexerClient.from(deref(network)).getRecentTransactionActions({
      account: deref(account),
      after: timeframeToPastTimestamp(deref(timeframe)) * 1_000_000,
      before: Date.now() * 1_000_000,
    });

  const { value: actions, isLoading } = usePromise(
    [account, timeframe, network].filter(w => isRef(w)) as WatchSource[],
    f,
    [],
  );

  return { actions, isLoading };
}
