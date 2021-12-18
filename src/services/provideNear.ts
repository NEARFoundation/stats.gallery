import { useAccountFromUrl } from '@/composables/useAccountFromUrl';
import { useNetworkFromUrl } from '@/composables/useNetworkFromUrl';
import { useTimeframeFromUrl } from '@/composables/useTimeframeFromUrl';
import mainnet from '@/networks/mainnet.json';
import testnet from '@/networks/testnet.json';
import { IndexerClient } from '@/services/near/indexer/IndexerClient';
import { Network } from '@/services/near/indexer/networks';
import { RpcClient } from '@/services/near/rpc/RpcClient';
import { Timeframe } from '@/utils/timeframe';
import LogRocket from 'logrocket';
import {
  connect,
  ConnectConfig,
  ConnectedWalletAccount,
  keyStores,
  Near,
  WalletConnection,
} from 'near-api-js';
import { AccountBalance } from 'near-api-js/lib/account';
import { provide, reactive, ref, Ref, watch } from 'vue';

export const NEAR_ACCOUNT = Symbol('near_account');
export const NEAR_ACCOUNT_BALANCE = Symbol('near_account_balance');
export const NEAR_NETWORK = Symbol('near_network');
export const NEAR_INDEXER = Symbol('near_indexer');
export const NEAR_RPC = Symbol('near_rpc');
export const NEAR_TIMEFRAME = Symbol('near_timeframe');
export const NEAR_WALLET = Symbol('near_wallet');
export const NEAR_WALLET_AUTH = Symbol('near_wallet_auth');
export const NEAR_CONNECTION = Symbol('near_connection');

const emptyAccountBalance = () =>
  ({
    available: '0',
    staked: '0',
    stateStaked: '0',
    total: '0',
  } as AccountBalance);

export interface WalletAuth {
  isSignedIn: boolean;
  isAccessible: boolean;
  accountId: string;
  account: ConnectedWalletAccount | null;
  accountBalance: AccountBalance;
  signOut: () => void;
  signIn: () => void;
}

const configs: {
  [key in Network]: Omit<ConnectConfig, 'keyStore' | 'headers'>;
} = {
  [Network.MAINNET]: mainnet,
  [Network.TESTNET]: testnet,
};

export function provideNear(): {
  account: Ref<string>;
  accountBalance: Ref<AccountBalance>;
  network: Ref<Network>;
  timeframe: Ref<Timeframe>;
  indexer: IndexerClient;
  rpc: RpcClient;
  wallet: Ref<WalletConnection | null>;
  walletAuth: WalletAuth;
  connection: Ref<Near | null>;
} {
  const account = useAccountFromUrl();
  provide(NEAR_ACCOUNT, account);
  const accountBalance = ref<AccountBalance>(emptyAccountBalance());
  provide(NEAR_ACCOUNT_BALANCE, accountBalance);
  const network = useNetworkFromUrl();
  provide(NEAR_NETWORK, network);
  const timeframe = useTimeframeFromUrl();
  provide(NEAR_TIMEFRAME, timeframe);
  const indexer = reactive(new IndexerClient(network.value)) as IndexerClient;
  provide(NEAR_INDEXER, indexer);
  const rpc = reactive(new RpcClient(network.value)) as RpcClient;
  provide(NEAR_RPC, rpc);
  const wallet = ref<WalletConnection | null>(
    null,
  ) as Ref<WalletConnection | null>;
  provide(NEAR_WALLET, wallet);
  const walletAuth = reactive<WalletAuth>({
    isSignedIn: false,
    isAccessible: true,
    account: null,
    accountId: '',
    accountBalance: emptyAccountBalance(),
    signOut() {
      walletAuth.account = null;
      walletAuth.accountId = '';
      walletAuth.isSignedIn = false;

      wallet.value?.signOut();
    },
    signIn() {
      wallet.value?.requestSignIn({}, 'stats.gallery');
    },
  }) as WalletAuth;
  provide(NEAR_WALLET_AUTH, walletAuth);
  const connection = ref<Near | null>(null) as Ref<Near | null>;
  provide(NEAR_CONNECTION, connection);

  watch([account, connection], async ([account, connection]) => {
    let a;
    try {
      a = await connection?.account(account);
    } catch (_) {
      void 0;
    }

    accountBalance.value = a
      ? await a.getAccountBalance()
      : emptyAccountBalance();
  });

  watch(
    network,
    async newNetwork => {
      indexer.network = newNetwork;
      rpc.network = newNetwork;

      const config = {
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        headers: {},
        ...configs[newNetwork],
      };

      const near = await connect(config);
      connection.value = near;

      const walletConnection = new WalletConnection(near, 'stats-gallery');
      wallet.value = walletConnection;

      const isSignedIn = walletConnection.isSignedIn();
      walletAuth.isSignedIn = isSignedIn;
      walletAuth.isAccessible = true;
      if (isSignedIn) {
        try {
          walletAuth.accountId = walletConnection.getAccountId();
          LogRocket.identify(walletAuth.accountId);
          walletAuth.account = walletConnection.account();
          walletAuth.accountBalance =
            await walletAuth.account.getAccountBalance();
        } catch (_) {
          // Wallet interactions may fail if:
          // 1. Account does not exist
          // 2. Wrong network
          walletAuth.isAccessible = false;
        }
      } else {
        walletAuth.accountId = '';
        walletAuth.account = null;
        walletAuth.accountBalance = emptyAccountBalance();
      }

      console.log(walletAuth);
    },
    { immediate: true },
  );

  return {
    account,
    accountBalance,
    network,
    timeframe,
    indexer,
    rpc,
    wallet,
    walletAuth,
    connection,
  };
}
