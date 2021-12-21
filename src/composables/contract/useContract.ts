import { usePromise } from '@/composables/usePromise';
import { Network } from '@/services/near/indexer/networks';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { deref } from '@/utils/deref';
import { parseContract, ParsedContract } from 'near-contract-parser';
import { Ref, WatchSource } from 'vue';

const emptyContract: ParsedContract = {
  probableInterfaces: [],
  byMethod: {},
  methodNames: [],
};

export function useContract({
  account,
  network,
}: {
  account: Ref<string>;
  network: Ref<Network>;
}): {
  contract: Ref<ParsedContract>;
  isLoading: Ref<boolean>;
} {
  const { value: contract, isLoading } = usePromise<ParsedContract>(
    [account, network] as WatchSource[],
    async () => {
      const viewRequest = await RpcClient.from(deref(network)).viewCode({
        account: deref(account),
        finality: 'final',
      });

      if ('result' in viewRequest) {
        return parseContract(viewRequest.result.code_base64);
      }

      return emptyContract;
    },
    emptyContract,
  );

  return { contract, isLoading };
}
