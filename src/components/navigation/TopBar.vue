<template>
  <nav class="h-20 bg-white p-2">
    <div class="w-full h-full lg:w-5/6 lg:mx-auto flex items-center">
      <div class="flex flex-grow items-center">
        <img
          class="h-9 mr-2 bg-green-500 rounded-full"
          src="@/assets/near_icon_wht.svg"
        />
        <img class="h-5" src="@/assets/near_brand.svg" />
        <div class="h-10 mx-3 bg-gray-400 w-0.5 rounded-full"></div>
        <span class="italic font-medium text-lg"> stats gallery </span>
      </div>
      <ToggleSwitch v-model="theme" />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
// .top-bar {
//   @apply relative
//     flex
//     items-center
//     justify-between
//     h-16
//     max-w-7xl
//     mx-auto
//     px-2
//     sm:px-6
//     lg:px-8;
// }

// .nav {
//   @apply sm:flex-1
//     flex
//     items-center
//     justify-center
//     sm:items-stretch sm:justify-start;

//   &__brand {
//     @apply flex-shrink-0 flex items-center;
//   }

//   &__image {
//     @apply block h-8 w-auto;
//   }

//   &__links {
//     @apply space-x-4 hidden sm:flex sm:ml-6;
//   }

//   &__link {
//     @apply text-gray-300 px-3 py-2 rounded-md text-sm font-medium cursor-pointer;

//     &:not(.router-link-active) {
//       @apply hover:bg-gray-700 hover:text-white;
//     }

//     &.router-link-active {
//       @apply bg-gray-900 text-white;
//     }
//   }
// }

// .search {
//   @apply rounded-md
//     shadow-sm
//     w-full
//     px-2
//     lg:px-6
//     flex-1 flex
//     justify-center
//     sm:justify-end;

//   &__input-wrapper {
//     @apply relative
//       flex-grow
//       text-indigo-200
//       focus-within:text-gray-400;
//   }

//   &__icon {
//     @apply absolute
//       inset-y-0
//       left-0
//       pl-3
//       flex
//       items-center
//       pointer-events-none;
//   }

//   &__input {
//     @apply block
//       w-full
//       pl-10
//       py-2
//       rounded-l-md
//       border border-transparent
//       leading-5
//       bg-indigo-400 bg-opacity-25
//       text-indigo-100
//       placeholder-indigo-200
//       hover:bg-indigo-500 hover:bg-opacity-25 hover:text-white
//       focus:bg-white focus:bg-opacity-100 focus:text-gray-900
//       focus:outline-none
//       focus:ring-0
//       focus:placeholder-gray-400
//       sm:text-sm;

//     -webkit-appearance: textfield;

//     &::-webkit-search-cancel-button,
//     &::-webkit-search-decoration {
//       -webkit-appearance: none;
//     }
//   }
// }

// .mobile-menu-button {
//   @apply sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white;
// }

// .mobile-menu {
//   @apply sm:hidden px-2 pt-2 pb-3 space-y-1;

//   &__item {
//     @apply block px-3 py-2 rounded-md text-base text-gray-300 font-medium cursor-pointer;

//     &:not(&--active) {
//       @apply hover:bg-gray-700 hover:text-white;
//     }

//     &--active {
//       @apply bg-gray-900 text-white;
//     }
//   }
// }
</style>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { defineComponent, Ref, ref, watch } from 'vue';
import ToggleSwitch from '../form/ToggleSwitch.vue';

export default defineComponent({
  components: {
    ToggleSwitch,
  },
  setup() {
    const { account, network: selectedNetwork } = useNear();

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
    };
  },
});
</script>
