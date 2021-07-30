<template>
  <nav class="bg-white p-6">
    <div
      class="
        w-full
        h-full
        xl:w-5/6 xl:mx-auto
        flex flex-wrap
        lg:flex-nowrap
        items-center
      "
    >
      <div class="flex flex-grow items-center">
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
        <SmallAccountInput class="w-full sm:w-48" v-model="displayedAccount" />
        <SmallTimeframeInput class="w-full sm:w-24" v-model="timeframe" />
        <SmallNetworkInput class="w-full sm:w-32" v-model="selectedNetwork" />
        <SmallPrimaryButton class="w-full sm:w-24">View</SmallPrimaryButton>
      </div>
      <ToggleSwitch v-model="theme" />
    </div>
  </nav>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { defineComponent, Ref, ref, watch } from 'vue';
import SmallAccountInput from '../form/SmallAccountInput.vue';
import SmallNetworkInput from '../form/SmallNetworkInput.vue';
import SmallTimeframeInput from '../form/SmallTimeframeInput.vue';
import SmallPrimaryButton from '../form/SmallPrimaryButton.vue';
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
    const { account, network: selectedNetwork, timeframe } = useNear();

    const open = ref(false);
    const displayedAccount = ref(account.value);
    watch(displayedAccount, () => {
      displayedAccount.value = displayedAccount.value.toLowerCase();
    });

    watch(account, newAccount => {
      displayedAccount.value = newAccount;
    });

    const updateAccount = () => {
      if (displayedAccount.value.trim().length === 0) {
        return;
      }

      account.value = displayedAccount.value;
    };

    const search: Ref<HTMLInputElement | null> = ref(null);

    const theme = ref(false);

    return {
      selectedNetwork,
      open,
      account,
      displayedAccount,
      updateAccount,
      search,
      theme,
      timeframe,
    };
  },
});
</script>
