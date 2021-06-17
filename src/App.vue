<template>
  <TopBar />
  <div class="relative py-16 bg-white overflow-hidden">
    <div class="relative px-4 sm:px-6 lg:px-8 mt-10 max-w-7xl sm:mx-auto">
      <router-view />
    </div>
  </div>
</template>

<style lang="stylus"></style>

<script lang="ts">
import TopBar from '@/components/navigation/TopBar.vue';
import { defineComponent, provide, reactive, ref, watch } from 'vue';
import { NearClient } from './services/near/NearClient';
import { Network } from './services/near/networks';

export default defineComponent({
  components: {
    TopBar,
  },
  setup() {
    provide('account', ref(''));
    const network = ref(Network.MAINNET);
    provide('network', network);
    const client = reactive(new NearClient(network.value));
    provide('near', client);

    watch(network, newNetwork => {
      client.network = newNetwork;
    });
  },
});
</script>
