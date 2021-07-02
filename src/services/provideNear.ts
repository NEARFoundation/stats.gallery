import { provide, reactive, watch } from 'vue';
import { NearClient } from './near/NearClient';
import { useAccountFromUrl } from './useAccountFromUrl';
import { useNetworkFromUrl } from './useNetworkFromUrl';

export const NEAR_ACCOUNT = Symbol('near_account');
export const NEAR_NETWORK = Symbol('near_network');
export const NEAR_CLIENT = Symbol('near_client');

export function provideNear(): void {
  provide(NEAR_ACCOUNT, useAccountFromUrl());
  const network = useNetworkFromUrl();
  provide(NEAR_NETWORK, network);
  const client = reactive(new NearClient(network.value));
  provide(NEAR_CLIENT, client);

  watch(network, newNetwork => {
    client.network = newNetwork;
  });
}
