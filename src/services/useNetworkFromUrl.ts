import { Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { isNetwork, Network } from './near/networks';

export function useNetworkFromUrl(): Ref<Network> {
  const network = ref(Network.MAINNET);
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
