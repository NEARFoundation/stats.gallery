import { provide, reactive, Ref, watch } from 'vue';
import { NearClient } from './near/NearClient';
import { Network } from './near/networks';
import { useAccountFromUrl } from './useAccountFromUrl';
import { useNetworkFromUrl } from './useNetworkFromUrl';

export const NEAR_ACCOUNT = Symbol('near_account');
export const NEAR_NETWORK = Symbol('near_network');
export const NEAR_CLIENT = Symbol('near_client');

export function provideNear(): {
  account: Ref<string>;
  network: Ref<Network>;
  client: NearClient;
} {
  const account = useAccountFromUrl();
  provide(NEAR_ACCOUNT, account);
  const network = useNetworkFromUrl();
  provide(NEAR_NETWORK, network);
  const client = reactive(new NearClient(network.value)) as NearClient;
  provide(NEAR_CLIENT, client);

  watch(network, newNetwork => {
    client.network = newNetwork;
  });

  return {
    account,
    network,
    client,
  };
}
