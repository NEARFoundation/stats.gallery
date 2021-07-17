import { usePromise } from '@/composables/usePromise';
import { IndexerClient } from '@/services/near/indexer/IndexerClient';
import { Network } from '@/services/near/indexer/networks';
import { UnifiedTransactionAction } from '@/services/near/indexer/types';
import { Timeframe, timeframeToPastTimestamp } from '@/services/timeframe';
import { Ref, WatchSource } from 'vue';

export function useRecentActions({
  account,
  network,
  timeframe,
}: {
  account: Ref<string>;
  network: Ref<Network>;
  timeframe: Ref<Timeframe>;
}): {
  actions: Ref<UnifiedTransactionAction[]>;
  isLoading: Ref<boolean>;
} {
  const f = () =>
    IndexerClient.from(network.value).getRecentTransactionActions({
      account: account.value,
      after: timeframeToPastTimestamp(timeframe.value) * 1_000_000,
      before: Date.now() * 1_000_000,
    });
  const { value: actions, isLoading } = usePromise(
    [account, network, timeframe] as WatchSource[],
    f,
    [],
  );

  return { actions, isLoading };
}
