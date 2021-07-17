<template>
  <TopBar />
  <AccountMayNotExistAlert
    v-if="!accountExists"
    class="my-4 mx-2"
    :account="account"
  />
  <div class="relative overflow-hidden">
    <div class="relative px-4 sm:px-6 lg:px-8 mt-10 max-w-7xl sm:mx-auto">
      <router-view v-slot="{ Component, route }">
        <component
          :is="Component"
          :key="route.meta.usePathKey ? route.path : undefined"
        />
      </router-view>
    </div>
  </div>
  <Footer />
</template>

<script lang="ts">
import AccountMayNotExistAlert from '@/components/alerts/AccountMayNotExistAlert.vue';
import Footer from '@/components/Footer.vue';
import TopBar from '@/components/navigation/TopBar.vue';
import { useTitle } from '@/composables/useTitle';
import { RouteTitleGenerator } from '@/router';
import { provideNear } from '@/services/provideNear';
import { defineComponent, ref, watch } from 'vue';
import { RouterView } from 'vue-router';

export default defineComponent({
  components: {
    TopBar,
    RouterView,
    Footer,
    AccountMayNotExistAlert,
  },
  setup() {
    const { account, network, rpc } = provideNear();
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
      if (typeof route.meta.title === 'function') {
        return (route.meta.title as RouteTitleGenerator)(route) + titleSuffix;
      } else {
        return (route.meta.title as string) + titleSuffix;
      }
    });

    return { account, accountExists };
  },
});
</script>
