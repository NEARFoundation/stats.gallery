<template>
  <router-view></router-view>
</template>

<style>
body {
  @apply text-gray-700;
  background-color: #f1f5f9;
}
</style>

<script lang="ts">
import { useTitle } from '@/composables/useTitle';
import { RouteTitleGenerator } from '@/router';
import { provideNear } from '@/services/provideNear';
import { defineComponent, ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useScore } from './composables/useScore';

export default defineComponent({
  components: {
    RouterView,
  },
  setup() {
    const { account, network, timeframe, rpc } = provideNear();
    const accountExists = ref(true);

    // Account exists RPC call watcher
    watch(
      [account, network],
      async ([account]) => {
        // Only bother checking if the user has actually entered an account
        if (account.length) {
          // Hide the alert during loading
          accountExists.value = true;
          const r = await rpc.viewAccount({
            account,
            finality: 'final',
          });
          accountExists.value = !(
            'error' in r &&
            r.error.data.includes('does not exist while viewing')
          );
        } else {
          accountExists.value = true;
        }
      },
      { immediate: true },
    );

    const titleSuffix = ' - near stats.gallery';

    useTitle(route => {
      const suffix = route.meta.noTitleSuffix ? '' : titleSuffix;
      if (typeof route.meta.title === 'function') {
        return (route.meta.title as RouteTitleGenerator)(route) + suffix;
      } else {
        return (route.meta.title as string) + suffix;
      }
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
          router.push(
            `/${network.value}/${account.value}?t=${timeframe.value}`,
          );
        }
      }
    });

    watch(
      route,
      () => {
        const match = route.matched[route.matched.length - 1];
        if (match && !route.query['t']) {
          // const { path } = match;
          // console.log(route.query);
          // const params = new URLSearchParams(route.query);
          // if (path.includes(':account') || path.includes(':network')) {
          //   router.replace(
          //     path
          //       .replace(':network', network.value)
          //       .replace(':account', account.value) +
          //       '?t=' +
          //       timeframe.value,
          //   );
          // }
        }
      },
      { immediate: true },
    );

    return {
      account,
      accountExists,
    };
  },
});
</script>
