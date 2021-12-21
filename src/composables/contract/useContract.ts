import { usePromise } from '@/composables/usePromise';
import { Network } from '@/services/near/indexer/networks';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { CodeView } from '@/services/near/rpc/types';
import { deref } from '@/utils/deref';
import { Ref, WatchSource } from 'vue';
import {
  getProbableInterfaces,
  IStandardInterface,
  StandardInterfaceId,
} from './interfaces';
import { parseWasm } from './parseWasm';

export interface IContract {
  probableInterfaces: StandardInterfaceId[];
  byMethod: Record<string, StandardInterfaceId[]>;
  methodNames: string[];
}

const emptyContract: IContract = {
  probableInterfaces: [],
  byMethod: {},
  methodNames: [],
};

function getMethodNames(codeView: CodeView): string[] {
  try {
    const ast = parseWasm(codeView.code_base64);
    return ast.body[0].fields
      .filter(
        (x: any) => x.type === 'ModuleExport' && x.descr.exportType === 'Func',
      )
      .map((x: any) => x.name) as string[];
  } catch (e) {
    console.error('Could not parse WASM', e);
    return [];
  }
}

export function useContract({
  account,
  network,
}: {
  account: Ref<string>;
  network: Ref<Network>;
}): {
  contract: Ref<IContract>;
  isLoading: Ref<boolean>;
} {
  const { value: contract, isLoading } = usePromise<IContract>(
    [account, network] as WatchSource[],
    async () => {
      const viewRequest = await RpcClient.from(deref(network)).viewCode({
        account: deref(account),
        finality: 'final',
      });

      if ('result' in viewRequest) {
        const methodNames = getMethodNames(viewRequest.result);
        const probableInterfaces = getProbableInterfaces(methodNames);
        return {
          methodNames,
          ...probableInterfaces,
        };
      }

      return emptyContract;
    },
    emptyContract,
  );

  return { contract, isLoading };
}
