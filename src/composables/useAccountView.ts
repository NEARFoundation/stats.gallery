import { Network } from '@/services/near/indexer/networks';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { AccountView } from '@/services/near/rpc/types';
import { deref, OptionalRef } from '@/utils/deref';
import { isRef, ref, Ref, watch } from 'vue';

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
  const isLoading = ref(true);
  const view = ref({} as AccountView | Record<string, never>);

  watch(
    [account, network, blockId ? blockId : finality].filter(x => isRef(x)),
    async () => {
      isLoading.value = true;

      const viewRequest = await RpcClient.from(deref(network)).viewAccount({
        account: deref(account),
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
