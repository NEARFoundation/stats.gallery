<template>
  <client-only>
    <Menu as="div" v-bind="$attrs" class="relative flex flex-1 justify-end">
      <MenuButton
        class="
          rounded-full
          flex-1
          md:flex-none
          flex
          items-center
          bg-gray-700
          hover:bg-gray-800
          py-1
          px-2
        "
      >
        <span class="sr-only">Open user menu</span>
        <UserCircleIcon class="w-7 h-7" />
        <div
          class="
            mx-2
            w-28
            flex-1
            md:flex-none
            font-medium
            truncate
            overflow-ellipsis
          "
        >
          {{ walletAuth.isSignedIn ? walletAuth.accountId : 'Account' }}
        </div>
        <ChevronDownIcon class="w-5 h-5" />
      </MenuButton>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems
          class="
            origin-top-right
            absolute
            z-20
            right-0
            top-full
            mt-2
            w-48
            rounded-sm
            shadow-lg
            bg-gray-700
            border border-gray-600
            ring-1 ring-black ring-opacity-5
            py-1
            focus:outline-none
          "
        >
          <MenuItem as="div" v-slot="{ active }">
            <router-link
              as="a"
              v-if="walletAuth.isSignedIn"
              :to="{
                name: 'overview',
                params: {
                  account: walletAuth.accountId,
                  network: network,
                },
                query: {
                  t: timeframe,
                },
              }"
              :class="[
                active ? 'bg-gray-800' : '',
                'block py-2 px-4 text-white',
              ]"
            >
              Profile
            </router-link>
          </MenuItem>
          <MenuItem as="div" v-if="walletAuth.isSignedIn" v-slot="{ active }">
            <a
              href="#"
              :class="[
                active ? 'bg-gray-800' : '',
                'block py-2 px-4 text-white',
              ]"
              @click="signOut"
              >Sign out</a
            >
          </MenuItem>
          <MenuItem as="div" v-if="!walletAuth.isSignedIn" v-slot="{ active }">
            <a
              href="#"
              :class="[
                active ? 'bg-gray-800' : '',
                'block py-2 px-4 text-white',
              ]"
              @click="signIn"
            >
              Sign in
            </a>
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>
  </client-only>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { ChevronDownIcon, UserCircleIcon } from 'heroicons-vue3/outline';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    UserCircleIcon,
    ChevronDownIcon,
  },
  setup() {
    const { wallet, walletAuth, account, timeframe, network } = useNear();

    const signIn = () => {
      wallet.value?.requestSignIn({}, 'stats.gallery');
    };

    const signOut = () => {
      walletAuth.signOut();
    };

    return {
      account,
      network,
      timeframe,
      walletAuth,
      signIn,
      signOut,
    };
  },
});
</script>
