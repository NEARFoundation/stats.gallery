import { Timeframe, timeframeToPastTimestamp } from '@/services/timeframe';
import { usePromise } from '@/services/usePromise';
import { Ref, WatchSource } from 'vue';
import { IndexerClient } from './IndexerClient';
import { Network } from './networks';
import { UnifiedTransactionAction } from './types';

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
    });
  const { value: actions, isLoading } = usePromise(
    [account, network, timeframe] as WatchSource[],
    f,
    [],
  );

  return { actions, isLoading };
}
