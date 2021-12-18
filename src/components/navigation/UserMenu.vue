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
            w-48
            flex flex-col
            rounded-sm
            shadow-lg
            bg-gray-700
            border border-gray-600
            ring-1 ring-black ring-opacity-5
            py-1
            focus:outline-none
          "
        >
          <button
            v-if="!walletAuth.isAccessible"
            @click="isAccountErrorModalOpen = true"
            class="
              my-1
              mx-4
              px-2
              py-1
              font-medium
              bg-orange-600 bg-opacity-20
              hover:bg-opacity-30
              rounded-sm
              border border-orange-400
            "
          >
            Account error
          </button>
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
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
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

    return {
      account,
      network,
      timeframe,
      walletAuth,
      signIn,
      signOut,
      isAccountErrorModalOpen,
    };
  },
});
</script>
