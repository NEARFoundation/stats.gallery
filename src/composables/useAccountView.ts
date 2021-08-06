import { Network } from '@/services/near/indexer/networks';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { AccountView } from '@/services/near/rpc/types';
import { deref, OptionalRef } from '@/utils/deref';
import { ref, Ref, watch } from 'vue';

export function useAccountView({
  account,
  network,
  blockId,
  finality,
}: {
  account: Ref<string>;
  network: Ref<Network>;
  blockId?: OptionalRef<string | number>;
  finality?: OptionalRef<'optimistic' | 'final'>;
}): {
  view: Ref<AccountView | Record<string, never>>;
  isLoading: Ref<boolean>;
} {
  const isLoading = ref(true);
  const view = ref({} as AccountView | Record<string, never>);

  watch(
    [account, network, blockId ? blockId : finality],
    async () => {
      isLoading.value = true;

      const viewRequest = await RpcClient.from(network.value).viewAccount({
        account: account.value,
        ...(blockId
          ? { blockId: deref(blockId) }
          : { finality: deref(finality) ?? 'final' }),
      });

      if ('result' in viewRequest) {
        view.value = viewRequest.result;
      }

      isLoading.value = false;
    },
    { immediate: true },
  );

  return { view, isLoading };
}
