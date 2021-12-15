import { useAccountFromUrl } from '@/composables/useAccountFromUrl';
import { useNetworkFromUrl } from '@/composables/useNetworkFromUrl';
import { useTimeframeFromUrl } from '@/composables/useTimeframeFromUrl';
import { IndexerClient } from '@/services/near/indexer/IndexerClient';
import { Network } from '@/services/near/indexer/networks';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { Timeframe } from '@/utils/timeframe';
import { provide, reactive, Ref, watch } from 'vue';

export const NEAR_ACCOUNT = Symbol('near_account');
export const NEAR_NETWORK = Symbol('near_network');
export const NEAR_INDEXER = Symbol('near_indexer');
export const NEAR_RPC = Symbol('near_rpc');
export const NEAR_TIMEFRAME = Symbol('near_timeframe');

export function provideNear(): {
  account: Ref<string>;
  network: Ref<Network>;
  timeframe: Ref<Timeframe>;
  indexer: IndexerClient;
  rpc: RpcClient;
} {
  const account = useAccountFromUrl();
  provide(NEAR_ACCOUNT, account);
  const network = useNetworkFromUrl();
  provide(NEAR_NETWORK, network);
  const timeframe = useTimeframeFromUrl();
  provide(NEAR_TIMEFRAME, timeframe);
  const indexer = reactive(new IndexerClient(network.value)) as IndexerClient;
  provide(NEAR_INDEXER, indexer);
  const rpc = reactive(new RpcClient(network.value)) as RpcClient;
  provide(NEAR_RPC, rpc);

  watch(network, newNetwork => {
    indexer.network = newNetwork;
    rpc.network = newNetwork;
  });

  return {
    account,
    network,
    timeframe,
    indexer,
    rpc,
  };
}
