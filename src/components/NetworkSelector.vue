<template>
  <Menu as="div" class="network-selector">
    <div>
      <!-- Network selector button -->
      <MenuButton class="network-selector__button">
        mainnet
        <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </MenuButton>
    </div>

    <!-- Network selector options -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="network-selector__menu">
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              :class="[
                active
                  ? 'network-selector__option--active'
                  : 'network-selector__option--inactive',
                'network-selector__option',
              ]"
              >mainnet</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              href="#"
              :class="[
                active
                  ? 'network-selector__option--active'
                  : 'network-selector__option--inactive',
                'network-selector__option',
              ]"
              >testnet</a
            >
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<style lang="scss" scoped>
.network-selector {
  @apply relative inline-block text-left;

  &__button {
    @apply inline-flex
      justify-center
      w-full
      rounded-r-md
      shadow-sm
      px-4
      py-2
      bg-transparent
      text-sm
      font-medium
      border border-transparent
      leading-5
      bg-indigo-400 bg-opacity-25
      text-indigo-100
      placeholder-indigo-200
      hover:bg-indigo-500 hover:bg-opacity-25 hover:text-white
      focus:bg-indigo-500 focus:bg-opacity-25 focus:text-white
      sm:text-sm;
  }

  &__menu {
    @apply origin-top-right z-10 absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none;
  }

  &__option {
    @apply block px-4 py-2 text-sm;

    &--inactive {
      @apply text-gray-700;
    }

    &--active {
      @apply bg-gray-100 text-gray-900;
    }
  }
}
</style>

<script lang="ts">
import { Menu, MenuItem, MenuItems, MenuButton } from '@headlessui/vue';
import { ChevronDownIcon } from 'heroicons-vue3/outline';

export default {
  components: {
    Menu,
    MenuItem,
    MenuItems,
    MenuButton,
    ChevronDownIcon,
  },
};
</script>
