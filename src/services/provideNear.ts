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
  Account,
  connect,
  ConnectConfig,
  ConnectedWalletAccount,
  keyStores,
  Near,
  WalletConnection,
} from 'near-api-js';
import { AccountView } from 'near-api-js/lib/providers/provider';
import { onMounted, provide, reactive, ref, Ref, watch } from 'vue';

export const NEAR_ACCOUNT = Symbol('near_account');
export const NEAR_ACCOUNT_VIEW = Symbol('near_account_view');
export const NEAR_NETWORK = Symbol('near_network');
export const NEAR_INDEXER = Symbol('near_indexer');
export const NEAR_RPC = Symbol('near_rpc');
export const NEAR_TIMEFRAME = Symbol('near_timeframe');
export const NEAR_WALLET = Symbol('near_wallet');
export const NEAR_WALLET_AUTH = Symbol('near_wallet_auth');
export const NEAR_CONNECTION = Symbol('near_connection');

const emptyAccountView = () =>
  ({
    amount: '0',
    block_hash: '',
    block_height: -1,
    code_hash: '',
    locked: '0',
    storage_paid_at: -1,
    storage_usage: -1,
  } as AccountView);

export interface WalletAuth {
  isSignedIn: boolean;
  isAccessible: boolean;
  accountId: string;
  account: ConnectedWalletAccount | null;
  accountView: AccountView;
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
  accountView: Ref<AccountView>;
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
  const accountView = ref<AccountView>(emptyAccountView());
  provide(NEAR_ACCOUNT_VIEW, accountView);
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
    accountView: emptyAccountView(),
    signOut() {
      walletAuth.account = null;
      walletAuth.accountId = '';
      walletAuth.isSignedIn = false;
      walletAuth.isAccessible = true;

      wallet.value?.signOut();
    },
    signIn() {
      wallet.value?.requestSignIn(
        {
          contractId: account.value, // function call key request
        },
        'stats.gallery',
      );
    },
  }) as WalletAuth;
  provide(NEAR_WALLET_AUTH, walletAuth);
  const connection = ref<Near | null>(null) as Ref<Near | null>;
  provide(NEAR_CONNECTION, connection);

  watch([account, connection], async ([account, connection]) => {
    let a: Account | undefined;
    try {
      a = await connection?.account(account);
    } catch (_) {
      void 0;
    }

    accountView.value = a ? await a.state() : emptyAccountView();
  });

  onMounted(() => {
    watch(
      [network, account],
      async ([network, account]) => {
        const config = {
          keyStore: new keyStores.BrowserLocalStorageKeyStore(),
          headers: {},
          ...configs[network],
        };

        const near = await connect(config);
        connection.value = near;

        const walletConnection = new WalletConnection(
          near,
          `stats.gallery$${network}$${account}`, // connection (and thus keystore) is network- and account-specific
        );
        wallet.value = walletConnection;

        const isSignedIn = walletConnection.isSignedIn();
        walletAuth.isSignedIn = isSignedIn;
        walletAuth.isAccessible = true;
        if (isSignedIn) {
          try {
            walletAuth.accountId = walletConnection.getAccountId();
            LogRocket.identify(walletAuth.accountId);
            walletAuth.account = walletConnection.account();
            walletAuth.accountView = await walletAuth.account.state();
          } catch (_) {
            // Wallet interactions may fail if:
            // 1. Account does not exist
            // 2. RPC is inaccessible
            walletAuth.isAccessible = false;
          }
        } else {
          walletAuth.accountId = '';
          walletAuth.account = null;
          walletAuth.accountView = emptyAccountView();
        }
      },
      { immediate: true },
    );
  });

  watch(
    network,
    async newNetwork => {
      indexer.network = newNetwork;
      rpc.network = newNetwork;
    },
    { immediate: true },
  );

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
