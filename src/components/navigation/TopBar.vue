<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="top-bar">
      <!-- Navigation links -->
      <div class="nav">
        <!-- Brand icon -->
        <div class="nav__brand">
          <img
            class="nav__image"
            src="@/assets/near_icon_wht.svg"
            alt="NEAR Edu"
          />
        </div>

        <!-- Nav links -->
        <div class="nav__links">
          <router-link
            v-slot="{ isActive }"
            :to="`/activity/${account}`"
            class="nav__link"
            :aria-current="isActive ? 'page' : undefined"
            >Activity</router-link
          >
          <router-link
            v-slot="{ isActive }"
            :to="`/charts/${account}`"
            class="nav__link"
            :aria-current="isActive ? 'page' : undefined"
            >Charts</router-link
          >
          <router-link
            v-slot="{ isActive }"
            to="/help"
            class="nav__link"
            :aria-current="isActive ? 'page' : undefined"
            >Help</router-link
          >
        </div>
      </div>

      <!-- Search section -->
      <div class="search">
        <label for="search" class="sr-only">Input account name</label>
        <!-- Input wrapper -->
        <div class="search__input-wrapper">
          <!-- Search icon -->
          <div class="search__icon">
            <SearchIcon class="h-5 w-5" aria-hidden="true" />
          </div>

          <!-- Search field -->
          <input
            id="search"
            name="search"
            class="search__input"
            placeholder="my-account.near&hellip;"
            type="search"
            v-model="displayedAccount"
            @blur="updateAccount"
            @keydown.enter="updateAccount"
          />
        </div>

        <!-- Network selector -->
        <NetworkSelector
          :selectedNetwork="selectedNetwork"
          @networkChanged="setSelectedNetwork"
        />
      </div>

      <!-- Mobile menu button-->
      <DisclosureButton class="mobile-menu-button">
        <span class="sr-only">Open main menu</span>
        <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
        <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
      </DisclosureButton>
    </div>

    <!-- Mobile menu -->
    <DisclosurePanel class="mobile-menu">
      <a
        v-for="item in navigation"
        :key="item.name"
        :href="item.href"
        :class="[
          'mobile-menu__item',
          item.current
            ? 'mobile-menu__item--active'
            : 'mobile-menu__item--inactive',
        ]"
        :aria-current="item.current ? 'page' : undefined"
        >{{ item.name }}</a
      >
    </DisclosurePanel>
  </Disclosure>
</template>

<style lang="scss" scoped>
.top-bar {
  @apply relative
    flex
    items-center
    justify-between
    h-16
    max-w-7xl
    mx-auto
    px-2
    sm:px-6
    lg:px-8;
}

.nav {
  @apply sm:flex-1
    flex
    items-center
    justify-center
    sm:items-stretch sm:justify-start;

  &__brand {
    @apply flex-shrink-0 flex items-center;
  }

  &__image {
    @apply block h-8 w-auto;
  }

  &__links {
    @apply space-x-4 hidden sm:flex sm:ml-6;
  }

  &__link {
    @apply px-3 py-2 rounded-md text-sm font-medium;

    &:not(.router-link-active) {
      @apply text-gray-300 hover:bg-gray-700 hover:text-white;
    }

    &.router-link-active {
      @apply bg-gray-900 text-white;
    }
  }
}

.search {
  @apply rounded-md
    shadow-sm
    w-full
    px-2
    lg:px-6
    flex-1 flex
    justify-center
    sm:justify-end;

  &__input-wrapper {
    @apply relative
      flex-grow
      text-indigo-200
      focus-within:text-gray-400;
  }

  &__icon {
    @apply absolute
      inset-y-0
      left-0
      pl-3
      flex
      items-center
      pointer-events-none;
  }

  &__input {
    @apply block
      w-full
      pl-10
      pr-3
      py-2
      rounded-l-md
      border border-transparent
      leading-5
      bg-indigo-400 bg-opacity-25
      text-indigo-100
      placeholder-indigo-200
      hover:bg-indigo-500 hover:bg-opacity-25 hover:text-white
      focus:bg-white focus:bg-opacity-100 focus:text-gray-900
      focus:outline-none
      focus:ring-0
      focus:placeholder-gray-400
      sm:text-sm;
  }
}

.mobile-menu-button {
  @apply sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white;
}

.mobile-menu {
  @apply sm:hidden px-2 pt-2 pb-3 space-y-1;

  &__item {
    @apply block px-3 py-2 rounded-md text-base font-medium;

    &--inactive {
      @apply text-gray-300 hover:bg-gray-700 hover:text-white;
    }

    &--active {
      @apply bg-gray-900 text-white;
    }
  }
}
</style>

<script lang="ts">
import { Network } from '@/services/near/networks';
import { nearContext } from '@/utils/near';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { MenuIcon, SearchIcon, XIcon } from 'heroicons-vue3/outline';
import { defineComponent, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import NetworkSelector from './NetworkSelector.vue';

const navigation = [
  { name: 'Activity', href: 'activity' },
  { name: 'Charts', href: 'charts' },
  { name: 'Help', href: 'help' },
];

export default defineComponent({
  components: {
    RouterLink,
    NetworkSelector,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    MenuIcon,
    XIcon,
    SearchIcon,
  },
  setup() {
    const { account, network: selectedNetwork } = nearContext();

    const open = ref(false);
    const displayedAccount = ref('');
    watch(displayedAccount, () => {
      displayedAccount.value = displayedAccount.value.toLowerCase();
    });

    const route = useRoute();
    const router = useRouter();

    const updateAccount = () => {
      account.value = displayedAccount.value;
      if (route.matched[0]) {
        const { path } = route.matched[0];
        if (path.includes(':account')) {
          router.push(path.replace(':account', account.value));
        }
      }
    };
    const setSelectedNetwork = (network: Network) => {
      selectedNetwork.value = network;
    };

    return {
      navigation,
      selectedNetwork,
      setSelectedNetwork,
      open,
      account,
      displayedAccount,
      updateAccount,
    };
  },
});
</script>
