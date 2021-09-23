<template>
  <router-view></router-view>
  <div id="tooltips"></div>
</template>

<style>
body {
  background-color: #f1f5f9;
  @apply text-gray-700 dark:text-white;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: rgb(11, 18, 31);
  }
}

hr {
  @apply dark:border-gray-800;
}

.prose blockquote {
  @apply dark:border-gray-600 !important;
}
</style>

<script lang="ts">
import { useTitle } from '@/composables/useTitle';
import { RouteTitleGenerator } from '@/router';
import { provideNear } from '@/services/provideNear';
import { defineComponent, onMounted, ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';

export default defineComponent({
  components: {
    RouterView,
  },
  setup() {
    const { account, network, timeframe, rpc } = provideNear();
    const accountExists = ref(true);

    // Account exists RPC call watcher
    onMounted(() => {
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
    });

    const titleSuffix =
      process.env['VUE_APP_TITLE_SUFFIX'] ?? ' - stats.gallery';

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
      router.push({
        name: route.name ?? 'overview',
        params: {
          network: network.value,
          account: account.value,
        },
        query: {
          t: timeframe.value,
        },
      });
    });

    watch(route, () => {
      // Reload Twitter button every page change
      const t = (window as any).twttr;

      if (t && t.widgets && t.widgets.load) {
        t.widgets.load();
      }
    });

    return {
      account,
      accountExists,
    };
  },
});
</script>
