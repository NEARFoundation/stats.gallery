<template>
  <div class="py-16 lg:py-64 flex flex-col items-center text-white bg-gray-700">
    <h1 class="font-bold text-4xl lg:text-6xl mb-5 mx-4 text-center">
      Investigate
      <span class="text-green-400 uppercase">your NEAR</span> account
    </h1>
    <p class="text-2xl lg:text-4xl mb-8">and 314,071 other accounts</p>
    <div
      class="
        flex flex-col
        lg:flex-row
        flex-shrink-0
        lg:space-x-4
        items-stretch
        lg:items-start
      "
    >
      <div class="flex flex-col flex-shrink-0">
        <AccountInput class="shadow-md" v-model="accountInputValue" />
        <small class="text-sm text-gray-400 text-center font-medium m-3"
          >Enter account name</small
        >
      </div>
      <div class="flex flex-col flex-shrink-0">
        <TimeframeInput
          class="shadow-md lg:w-48"
          v-model="timeframeInputValue"
        />
        <small class="text-sm text-gray-400 text-center font-medium m-3"
          >Select range</small
        >
      </div>
      <div class="flex flex-col flex-shrink-0">
        <NetworkInput class="shadow-md lg:w-48" v-model="networkInputValue" />
        <small class="text-sm text-gray-400 text-center font-medium m-3"
          >Select network</small
        >
      </div>
      <PrimaryButton>Show stats</PrimaryButton>
    </div>
  </div>
</template>

<style scoped></style>

<script lang="ts">
import AccountInput from '@/components/form/AccountInput.vue';
import NetworkInput from '@/components/form/NetworkInput.vue';
import PrimaryButton from '@/components/form/PrimaryButton.vue';
import TimeframeInput from '@/components/form/TimeframeInput.vue';
import { Network } from '@/services/near/indexer/networks';
import { Timeframe } from '@/services/timeframe';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: { AccountInput, TimeframeInput, NetworkInput, PrimaryButton },
  name: 'intake-hero',
  setup() {
    const accountInputValue = ref('');
    const timeframeInputValue = ref<Timeframe>(Timeframe.WEEK);
    const networkInputValue = ref<Network>(Network.MAINNET);

    return {
      accountInputValue,
      timeframeInputValue,
      networkInputValue,
    };
  },
});
</script>
