<template>
  <TopBar />
  <div class="relative overflow-hidden">
    <div class="relative px-4 sm:px-6 lg:px-8 mt-10 max-w-7xl sm:mx-auto">
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component
            :is="Component"
            :key="route.meta.usePathKey ? route.path : undefined"
          />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import TopBar from '@/components/navigation/TopBar.vue';
import { NearClient } from '@/services/near/NearClient';
import { Network } from '@/services/near/networks';
import { useAccountFromUrl } from '@/services/useAccountFromUrl';
import { useTitle } from '@/services/useTitle';
import { defineComponent, provide, reactive, ref, watch } from 'vue';
import { RouterView } from 'vue-router';

export default defineComponent({
  components: {
    TopBar,
    RouterView,
  },
  setup() {
    provide('account', useAccountFromUrl());
    const network = ref(Network.MAINNET);
    provide('network', network);
    const client = reactive(new NearClient(network.value));
    provide('near', client);

    watch(network, newNetwork => {
      client.network = newNetwork;
    });

    useTitle(route => {
      return route.meta.title as string;
    });
  },
});
</script>
