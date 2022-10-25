<template>
  <router-view></router-view>
</template>

<style>
body {
  background-color: #f1f5f9;
}

#app {
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

.custom-scrollbar {
  scrollbar-color: dark;
  scrollbar-width: thin;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
  background-color: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.4);
  border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(128, 128, 128, 0.6);
}

* {
  @apply focus-visible:ring-green-500 focus-visible:ring-2;
  @apply focus-visible:outline-none !important;
}
</style>

<script lang="ts">
import { useTitle } from '@/composables/useTitle';
import { TITLE_SUFFIX } from '@/constants';
import { RouteTitleGenerator } from '@/router';
import { provideNear } from '@/services/provideNear';
import { defineComponent, onMounted, provide, ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';

export default defineComponent({
  components: {
    RouterView,
  },
  setup() {
    const { account, network, timeframe, rpc } = provideNear();
    const accountExists = ref(true);

    provide('autoTeleport', '#teleport-root');

    onMounted(() => {
      // Auto dark theme
      // Using class so that elements can still escape dark theming by
      // teleporting outside of #theme-sandbox
      const updateTheme = (dark: boolean) => {
        document
          .getElementById('theme-sandbox')
          ?.classList.toggle('dark', dark);
      };

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      mediaQuery.addEventListener('change', e => {
        updateTheme(e.matches);
      });

      updateTheme(mediaQuery.matches);

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
    });

    const titleSuffix = TITLE_SUFFIX ?? ' - stats.gallery';

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

    // When redirected back from wallet, clear query parameters
    // Otherwise we sometimes end up with duplicate keys because near-api-js is over-ambitious
    const stop = watch(
      route,
      route => {
        if (route.name) {
          const {
            query: { account_id, public_key, all_keys, ...filtered },
          } = route;

          if (account_id && public_key && all_keys) {
            stop();

            router.replace({
              name: route.name ?? 'overview',
              query: filtered,
            });
          }
        }
      },
      { immediate: true },
    );

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

    return {
      account,
      accountExists,
    };
  },
});
</script>
