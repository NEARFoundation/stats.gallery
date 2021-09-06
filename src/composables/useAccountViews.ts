import { Network } from '@/services/near/indexer/networks';
import { Action } from '@/services/near/indexer/types';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { AccountView, RpcResponse } from '@/services/near/rpc/types';
import { Ref } from 'vue';
import { usePromise } from './usePromise';

export function useAccountViews({
  account,
  actions,
  network,
}: {
  account: Ref<string>;
  actions: Ref<Action[]>;
  network: Ref<Network>;
}): {
  views: Ref<(AccountView | undefined)[]>;
  isLoading: Ref<boolean>;
} {
  const { value: views, isLoading } = usePromise<(AccountView | undefined)[]>(
    actions,
    async () => {
      // Block hash -> Request
      const blockRequests = new Map<
        string,
        Promise<RpcResponse<AccountView>>
      >();

      return (
        await Promise.all(
          actions.value.map(action => {
            const value = blockRequests.get(action.block_hash);
            if (value) {
              return value;
            }

            const r = RpcClient.from(network.value).viewAccount({
              account: account.value,
              blockId: action.block_hash,
            });

            blockRequests.set(action.block_hash, r);
            return r;
          }),
        )
      ).map(r => ('result' in r ? r.result : undefined));
    },
    [],
  );

  return { views, isLoading };
}
