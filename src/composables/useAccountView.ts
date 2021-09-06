import { Network } from '@/services/near/indexer/networks';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { AccountView } from '@/services/near/rpc/types';
import { deref, OptionalRef } from '@/utils/deref';
import { isRef, Ref, WatchSource } from 'vue';
import { usePromise } from './usePromise';

export function useAccountView({
  account,
  network,
  blockId,
  finality,
}: {
  account: OptionalRef<string>;
  network: OptionalRef<Network>;
  blockId?: OptionalRef<string | number>;
  finality?: OptionalRef<'optimistic' | 'final'>;
}): {
  view: Ref<AccountView | Record<string, never>>;
  isLoading: Ref<boolean>;
} {
  const { value: view, isLoading } = usePromise<
    AccountView | Record<string, never>
  >(
    [account, network, blockId ? blockId : finality].filter(x =>
      isRef(x),
    ) as WatchSource[],
    async () => {
      const viewRequest = await RpcClient.from(deref(network)).viewAccount({
        account: deref(account),
        ...(blockId
          ? { blockId: deref(blockId) }
          : { finality: deref(finality) ?? 'final' }),
      });

      if ('result' in viewRequest) {
        return viewRequest.result;
      } else {
        return {};
      }
    },
    {},
  );

  return { view, isLoading };
}
