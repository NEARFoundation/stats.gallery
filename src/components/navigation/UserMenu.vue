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
          bg-white
          border border-gray-300
          dark:border-transparent
          hover:bg-gray-100
          dark:bg-gray-700 dark:hover:bg-gray-800
          py-1
          px-2
        "
      >
        <span class="sr-only">Open user menu</span>
        <UserCircleIcon v-if="walletAuth.isAccessible" class="w-7 h-7" />
        <ExclamationCircleIcon
          v-if="!walletAuth.isAccessible"
          class="w-7 h-7 text-orange-400"
        />
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
            w-56
            flex flex-col
            rounded-sm
            shadow-lg
            bg-white
            dark:bg-gray-700
            border
            dark:border-gray-600
            ring-1 ring-black ring-opacity-5
            py-1
            focus:outline-none
          "
        >
          <div
            v-if="!walletAuth.isSignedIn"
            class="
              self-center
              m-1
              mb-3
              px-1.5
              py-1
              text-center
              bg-pink-700
              text-white text-sm
              rounded-sm
              shadow-sm
            "
          >
            Access contract actions
          </div>
          <MenuItem
            v-if="!walletAuth.isAccessible"
            @click="isAccountErrorModalOpen = true"
            v-slot="{ active }"
          >
            <button
              class="
                my-1
                mx-4
                text-center
                px-2
                py-1
                font-medium
                rounded-sm
                bg-opacity-30
                dark:bg-opacity-40
                border border-orange-400
                dark:border-orange-600
                cursor-pointer
              "
              :class="[
                active
                  ? 'bg-orange-500 text-orange-900 dark:bg-orange-600 dark:text-white'
                  : 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-100',
              ]"
            >
              Account error
            </button>
          </MenuItem>
          <MenuItem v-if="walletAuth.isSignedIn" v-slot="{ active }">
            <router-link
              as="a"
              :class="userMenuItemClass(active)"
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
            >
              Overview
            </router-link>
          </MenuItem>
          <MenuItem
            v-if="walletAuth.isSignedIn"
            @click="signOut"
            v-slot="{ active }"
          >
            <a href="#" :class="userMenuItemClass(active)">Sign out</a>
          </MenuItem>
          <MenuItem
            v-if="!walletAuth.isSignedIn"
            @click="signIn"
            v-slot="{ active }"
          >
            <a href="#" :class="userMenuItemClass(active)"
              >Sign into {{ account }}</a
            >
          </MenuItem>
        </MenuItems>
      </transition>
    </Menu>
    <Modal
      v-if="!walletAuth.isAccessible"
      :open="isAccountErrorModalOpen"
      @close="isAccountErrorModalOpen = false"
      title="Account error"
      prose
    >
      <p>The selected account is inaccessible.</p>
      <ul>
        <li>
          Keys may have stopped working. Try signing out and signing back in.
        </li>
        <li>
          The account may be on a different network (e.g. testnet account on
          mainnet or vice-versa). Try changing the active network.
        </li>
      </ul>
    </Modal>
  </client-only>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import {
  ChevronDownIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
} from 'heroicons-vue3/outline';
import { defineComponent, ref } from 'vue';
import Modal from '../Modal.vue';

export default defineComponent({
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    UserCircleIcon,
    ChevronDownIcon,
    ExclamationCircleIcon,
    Modal,
  },
  setup() {
    const { walletAuth, account, timeframe, network } = useNear();

    const isAccountErrorModalOpen = ref(false);

    const signIn = () => {
      walletAuth.signIn();
    };

    const signOut = () => {
      walletAuth.signOut();
    };

    const userMenuItemClass = (active: boolean) => [
      active ? 'text-black dark:text-white bg-gray-100 dark:bg-gray-800' : '',
      'block py-2 px-4 truncate',
    ];

    return {
      account,
      network,
      timeframe,
      walletAuth,
      signIn,
      signOut,
      isAccountErrorModalOpen,
      userMenuItemClass,
    };
  },
});
</script>
