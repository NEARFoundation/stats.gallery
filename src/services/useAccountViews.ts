import { Network } from '@/services/near/indexer/networks';
import { UnifiedTransactionAction } from '@/services/near/indexer/types';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { RpcResponse, RpcViewAccountResult } from '@/services/near/rpc/types';
import { ref, Ref, watch } from 'vue';

export function useAccountViews({
  account,
  actions,
  network,
}: {
  account: Ref<string>;
  actions: Ref<UnifiedTransactionAction[]>;
  network: Ref<Network>;
}): {
  views: Ref<RpcResponse<RpcViewAccountResult>[]>;
  isLoading: Ref<boolean>;
} {
  const isLoading = ref(true);
  const views = ref([] as RpcResponse<RpcViewAccountResult>[]);

  watch(
    actions,
    async () => {
      isLoading.value = true;
      views.value = await Promise.all(
        actions.value.flatMap(action => [
          RpcClient.from(network.value).viewAccount({
            account: account.value,
            blockId: action.receipt_included_in_block_height + 1, // Wait for gas to be settled
          }),
        ]),
      );
      isLoading.value = false;
    },
    { immediate: true },
  );

  return { views, isLoading };
}
