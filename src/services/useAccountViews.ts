import { Network } from '@/services/near/indexer/networks';
import { Action } from '@/services/near/indexer/types';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { AccountView } from '@/services/near/rpc/types';
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
      views.value = (
        await Promise.all(
          actions.value.map(action =>
            RpcClient.from(network.value).viewAccount({
              account: account.value,
              blockId: action.block_hash,
            }),
          ),
        )
      ).map(r => ('result' in r ? r.result : undefined));
      isLoading.value = false;
    },
    { immediate: true },
  );

  return { views, isLoading };
}
