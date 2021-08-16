<template>
  <div
    class="w-full hidden md:flex justify-center bg-white"
    v-if="!!bannerImagePath"
  >
    <a :href="bannerHref" target="_blank" rel="noreferrer">
      <img class="max-h-12" :src="bannerImagePath" alt="Announcement banner" />
    </a>
  </div>
  <nav class="bg-white p-6">
    <div
      class="
        w-full
        h-full
        xl:w-5/6 xl:mx-auto
        flex flex-wrap
        lg:flex-nowrap
        items-center
        justify-between
      "
    >
      <div class="flex items-center">
        <img
          class="h-9 mr-2 bg-green-600 rounded-full"
          src="@/assets/near_icon_wht.svg"
        />
        <img class="hidden sm:block h-5 mr-3" src="@/assets/near_brand.svg" />
        <div class="italic font-medium text-lg whitespace-nowrap">
          stats gallery
        </div>
      </div>
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
        <SmallAccountInput
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
      <ToggleSwitch v-model="theme" />
    </div>
  </nav>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { defineComponent, ref, watch } from 'vue';
import SmallAccountInput from '../form/SmallAccountInput.vue';
import SmallNetworkInput from '../form/SmallNetworkInput.vue';
import SmallPrimaryButton from '../form/SmallPrimaryButton.vue';
import SmallTimeframeInput from '../form/SmallTimeframeInput.vue';
import ToggleSwitch from '../form/ToggleSwitch.vue';

export default defineComponent({
  components: {
    ToggleSwitch,
    SmallAccountInput,
    SmallNetworkInput,
    SmallTimeframeInput,
    SmallPrimaryButton,
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

      account.value = displayedAccount.value;
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
