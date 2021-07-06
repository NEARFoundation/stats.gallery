import { Ref, WatchSource } from 'vue';
import { Timeframe, timeframeToPastTimestamp } from '../timeframe';
import { usePromise } from '../usePromise';
import { NearClient } from './NearClient';
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
    NearClient.from(network.value).getRecentTransactionActions({
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
