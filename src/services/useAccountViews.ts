import { Network } from '@/services/near/indexer/networks';
import {
  Action,
  UnifiedTransactionAction,
} from '@/services/near/indexer/types';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { RpcResponse, AccountView } from '@/services/near/rpc/types';
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
  views: Ref<RpcResponse<AccountView>[]>;
  isLoading: Ref<boolean>;
} {
  const isLoading = ref(true);
  const views = ref([] as RpcResponse<AccountView>[]);

  watch(
    actions,
    async () => {
      isLoading.value = true;
      views.value = await Promise.all(
        actions.value.flatMap(action => [
          RpcClient.from(network.value).viewAccount({
            account: account.value,
            blockId: action.block_hash,
          }),
        ]),
      );
      isLoading.value = false;
    },
    { immediate: true },
  );

  return { views, isLoading };
}
