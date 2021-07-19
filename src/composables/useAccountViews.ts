import { Network } from '@/services/near/indexer/networks';
import { Action } from '@/services/near/indexer/types';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { AccountView, RpcResponse } from '@/services/near/rpc/types';
import { ref, Ref, watch } from 'vue';

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
  const isLoading = ref(true);
  const views = ref([] as (AccountView | undefined)[]);

  watch(
    actions,
    async () => {
      isLoading.value = true;
      // Block hash -> Request
      const blockRequests = new Map<
        string,
        Promise<RpcResponse<AccountView>>
      >();
      views.value = (
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
      isLoading.value = false;
    },
    { immediate: true },
  );

  return { views, isLoading };
}
