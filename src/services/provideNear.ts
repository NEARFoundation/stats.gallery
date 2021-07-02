import { provide, reactive, ref, watch } from 'vue';
import { NearClient } from './near/NearClient';
import { Network } from './near/networks';
import { useAccountFromUrl } from './useAccountFromUrl';

export const NEAR_ACCOUNT = Symbol('near_account');
export const NEAR_NETWORK = Symbol('near_network');
export const NEAR_CLIENT = Symbol('near_client');
export const NEAR_ACCOUNT_URL = Symbol('near_account_url');

export function provideNear() {
  const { account, exists } = useAccountFromUrl();
  provide(NEAR_ACCOUNT, account);
  const network = ref(Network.MAINNET);
  provide(NEAR_NETWORK, network);
  const client = reactive(new NearClient(network.value));
  provide(NEAR_CLIENT, client);

  watch(network, newNetwork => {
    client.network = newNetwork;
  });
}
