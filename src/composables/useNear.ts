import { IndexerClient } from '@/services/near/indexer/IndexerClient';
import { Network } from '@/services/near/indexer/networks';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import {
  NEAR_ACCOUNT,
  NEAR_ACCOUNT_VIEW,
  NEAR_CONNECTION,
  NEAR_INDEXER,
  NEAR_NETWORK,
  NEAR_RPC,
  NEAR_TIMEFRAME,
  NEAR_WALLET,
  NEAR_WALLET_AUTH,
  WalletAuth,
} from '@/services/provideNear';
import { Timeframe } from '@/utils/timeframe';
import { Near, WalletConnection } from 'near-api-js';
import { AccountView } from 'near-api-js/lib/providers/provider';
import { inject, Ref } from 'vue';

export function useNear(): {
  account: Ref<string>;
  accountView: Ref<AccountView>;
  network: Ref<Network>;
  timeframe: Ref<Timeframe>;
  indexer: IndexerClient;
  rpc: RpcClient;
  wallet: Ref<WalletConnection | null>;
  walletAuth: WalletAuth;
  connection: Ref<Near | null>;
} {
  // TODO: Fallback?
  // eslint-disable-next-line
  const account = inject<Ref<string>>(NEAR_ACCOUNT)!;
  // eslint-disable-next-line
  const accountView = inject<Ref<AccountView>>(NEAR_ACCOUNT_VIEW)!;
  // eslint-disable-next-line
  const network = inject<Ref<Network>>(NEAR_NETWORK)!;
  // eslint-disable-next-line
  const timeframe = inject<Ref<Timeframe>>(NEAR_TIMEFRAME)!;
  // eslint-disable-next-line
  const indexer = inject<IndexerClient>(NEAR_INDEXER)!;
  // eslint-disable-next-line
  const rpc = inject<RpcClient>(NEAR_RPC)!;
  // eslint-disable-next-line
  const wallet = inject<Ref<WalletConnection | null>>(NEAR_WALLET)!;
  // eslint-disable-next-line
  const walletAuth = inject<WalletAuth>(NEAR_WALLET_AUTH)!;
  // eslint-disable-next-line
  const connection = inject<Ref<Near | null>>(NEAR_CONNECTION)!;

  return {
    account,
    accountView,
    network,
    timeframe,
    indexer,
    rpc,
    wallet,
    walletAuth,
    connection,
  };
}
