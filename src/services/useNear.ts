import { IndexerClient } from '@/services/near/indexer/IndexerClient';
import { Network } from '@/services/near/indexer/networks';
import { inject, Ref } from 'vue';
import { RpcClient } from './near/rpc/RpcClient';
import {
  NEAR_ACCOUNT,
  NEAR_INDEXER,
  NEAR_NETWORK,
  NEAR_RPC,
  NEAR_TIMEFRAME,
} from './provideNear';
import { Timeframe } from './timeframe';

export function useNear(): {
  account: Ref<string>;
  network: Ref<Network>;
  timeframe: Ref<Timeframe>;
  indexer: IndexerClient;
  rpc: RpcClient;
} {
  // TODO: Fallback?
  // eslint-disable-next-line
  const account = inject<Ref<string>>(NEAR_ACCOUNT)!;
  // eslint-disable-next-line
  const network = inject<Ref<Network>>(NEAR_NETWORK)!;
  // eslint-disable-next-line
  const timeframe = inject<Ref<Timeframe>>(NEAR_TIMEFRAME)!;
  // eslint-disable-next-line
  const indexer = inject<IndexerClient>(NEAR_INDEXER)!;
  // eslint-disable-next-line
  const rpc = inject<RpcClient>(NEAR_RPC)!;

  return {
    account,
    network,
    timeframe,
    indexer,
    rpc,
  };
}
