import { inject, Ref } from 'vue';
import { NearClient } from './near/NearClient';
import { Network } from './near/networks';
import { NEAR_ACCOUNT, NEAR_CLIENT, NEAR_NETWORK } from './provideNear';

export function useNear(): {
  account: Ref<string>;
  network: Ref<Network>;
  client: NearClient;
} {
  // TODO: Fallback?
  // eslint-disable-next-line
  const account = inject<Ref<string>>(NEAR_ACCOUNT)!;
  // eslint-disable-next-line
  const network = inject<Ref<Network>>(NEAR_NETWORK)!;
  // eslint-disable-next-line
  const client = inject<NearClient>(NEAR_CLIENT)!;

  return {
    account,
    network,
    client,
  };
}
