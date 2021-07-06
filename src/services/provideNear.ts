import { provide, reactive, Ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NearClient } from './near/NearClient';
import { Network } from './near/networks';
import { useAccountFromUrl } from './useAccountFromUrl';
import { useNetworkFromUrl } from './useNetworkFromUrl';
import { useTimeframeFromUrl } from './useTimeframeFromUrl';

export const NEAR_ACCOUNT = Symbol('near_account');
export const NEAR_NETWORK = Symbol('near_network');
export const NEAR_CLIENT = Symbol('near_client');
export const NEAR_TIMEFRAME = Symbol('near_timeframe');

export function provideNear(): {
  account: Ref<string>;
  network: Ref<Network>;
  client: NearClient;
} {
  const account = useAccountFromUrl();
  provide(NEAR_ACCOUNT, account);
  const network = useNetworkFromUrl();
  provide(NEAR_NETWORK, network);
  const timeframe = useTimeframeFromUrl();
  provide(NEAR_TIMEFRAME, timeframe);
  const client = reactive(new NearClient(network.value)) as NearClient;
  provide(NEAR_CLIENT, client);

  watch(network, newNetwork => {
    client.network = newNetwork;
  });

  const route = useRoute();
  const router = useRouter();

  watch([account, network, timeframe], () => {
    if (route.matched[0]) {
      const { path } = route.matched[0];
      if (path.includes(':account') || path.includes(':network')) {
        router.push(
          path
            .replace(':network', network.value)
            .replace(':account', account.value) +
            '?t=' +
            timeframe.value,
        );
      } else if (account.value) {
        router.push(`/${network.value}/${account.value}?t=${timeframe.value}`);
      }
    }
  });

  watch(
    route,
    () => {
      if (route.matched[0] && !route.query['t']) {
        const { path } = route.matched[0];
        if (path.includes(':account') || path.includes(':network')) {
          router.replace(
            path
              .replace(':network', network.value)
              .replace(':account', account.value) +
              '?t=' +
              timeframe.value,
          );
        }
      }
    },
    { immediate: true },
  );

  return {
    account,
    network,
    client,
  };
}
