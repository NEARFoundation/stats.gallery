import { isNetwork, Network } from '@/services/near/indexer/networks';
import { usePreference } from '@/services/usePreference';
import { Ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const NEAR_NETWORK_PREFERENCES_KEY = 'near-network';

export function useNetworkFromUrl(): Ref<Network> {
  const network = usePreference<Network>(
    NEAR_NETWORK_PREFERENCES_KEY,
    Network.MAINNET,
  );
  const route = useRoute();

  watch(
    route,
    currentRoute => {
      const { network: networkParam } = currentRoute.params;
      if (networkParam && isNetwork(networkParam)) {
        network.value = networkParam;
      }
    },
    {
      immediate: true,
    },
  );

  return network;
}
