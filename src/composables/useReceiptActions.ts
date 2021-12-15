import { usePromise } from '@/composables/usePromise';
import { IndexerClient } from '@/services/near/indexer/IndexerClient';
import { Network } from '@/services/near/indexer/networks';
import { ReceiptAction } from '@/services/near/indexer/types';
import { Timeframe, timeframeToPastTimestamp } from '@/utils/timeframe';
import { deref, OptionalRef } from '@/utils/deref';
import { Ref, WatchSource } from 'vue';

export function useReceiptActions({
  account,
  network,
  timeframe,
}: {
  account: OptionalRef<string>;
  network: OptionalRef<Network>;
  timeframe: OptionalRef<Timeframe>;
}): {
  actions: Ref<ReceiptAction[]>;
  isLoading: Ref<boolean>;
} {
  const f = () =>
    IndexerClient.from(deref(network)).getActions({
      account: deref(account),
      after: timeframeToPastTimestamp(deref(timeframe)) * 1_000_000,
      before: Date.now() * 1_000_000,
    });

  const { value: actions, isLoading } = usePromise(
    [account, network, timeframe] as WatchSource[],
    f,
    [],
  );

  return { actions, isLoading };
}
