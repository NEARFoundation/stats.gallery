<template>
  <div
    class="w-full hidden md:flex justify-center bg-white"
    v-if="!!bannerImagePath"
  >
    <a :href="bannerHref" target="_blank" rel="noreferrer">
      <img class="max-h-12" :src="bannerImagePath" alt="Announcement banner" />
    </a>
  </div>
  <nav class="bg-white p-6 dark:bg-gray-900 dark:text-gray-100">
    <div
      class="
        w-full
        h-full
        max-w-7xl
        xl:mx-auto
        flex flex-wrap
        lg:flex-nowrap
        items-center
        justify-between
      "
    >
      <router-link :to="{ name: 'landing' }" class="flex items-center">
        <StatsGalleryLogo class="p-1 h-9" />
      </router-link>
      <div
        v-if="showIntake"
        class="
          flex flex-col
          sm:flex-row
          space-y-3
          sm:space-y-0 sm:space-x-3 sm:justify-center
          lg:justify-end
          items-center
          mx-3
          mt-4
          lg:mt-0 lg:mr-8
          order-last
          lg:order-none
          w-full
          lg:w-auto
        "
      >
        <SmallTextInput
          placeholder="my-account.near"
          class="w-full sm:w-48"
          v-model="displayedAccount"
          @submit="update"
        />
        <SmallTimeframeInput
          class="w-full sm:w-24"
          v-model="selectedTimeframe"
        />
        <SmallNetworkInput class="w-full sm:w-32" v-model="selectedNetwork" />
        <SmallPrimaryButton class="w-full sm:w-24" @click="update"
          >View</SmallPrimaryButton
        >
      </div>
      <router-link :to="{ name: 'story' }" v-slot="{ isActive }">
        <span
          :class="[
            isActive
              ? 'text-gray-700 bg-gray-400 dark:text-gray-50'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-50',
          ]"
          class="font-medium rounded px-3 py-1 bg-opacity-20"
          >story</span
        >
      </router-link>
    </div>
  </nav>
</template>

<script lang="ts">
import StatsGalleryLogo from '@/components/icons/StatsGalleryLogo.vue';
import { useNear } from '@/composables/useNear';
import { defineComponent, ref, watch } from 'vue';
import SmallTextInput from '../form/SmallTextInput.vue';
import SmallNetworkInput from '../form/SmallNetworkInput.vue';
import SmallPrimaryButton from '../form/SmallPrimaryButton.vue';
import SmallTimeframeInput from '../form/SmallTimeframeInput.vue';
// import ToggleSwitch from '../form/ToggleSwitch.vue';

export default defineComponent({
  components: {
    // ToggleSwitch,
    SmallTextInput,
    SmallNetworkInput,
    SmallTimeframeInput,
    SmallPrimaryButton,
    StatsGalleryLogo,
  },
  props: {
    showIntake: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { account, network, timeframe } = useNear();

    const displayedAccount = ref(account.value);
    const selectedNetwork = ref(network.value);
    const selectedTimeframe = ref(timeframe.value);

    watch(account, newAccount => {
      displayedAccount.value = newAccount;
    });

    const update = () => {
      if (displayedAccount.value.trim().length === 0) {
        return;
      }

      account.value = displayedAccount.value.toLowerCase();
      network.value = selectedNetwork.value;
      timeframe.value = selectedTimeframe.value;
    };

    const theme = ref(false);

    const bannerImagePath = process.env['VUE_APP_BANNER_IMAGE_PATH'];
    const bannerHref = process.env['VUE_APP_BANNER_HREF'];

    return {
      displayedAccount,
      selectedNetwork,
      selectedTimeframe,
      update,
      theme,
      bannerImagePath,
      bannerHref,
    };
  },
});
</script>
