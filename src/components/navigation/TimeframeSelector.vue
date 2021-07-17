<template>
  <Menu as="div" class="timeframe-selector">
    <div>
      <!-- Timeframe selector button -->
      <MenuButton class="timeframe-selector__button">
        <span class="sr-only">Timeframe Selector</span>
        <span class="hidden md:block">
          {{ timeframe }}
        </span>
        <CalendarIcon class="block md:hidden h-5 w-5" aria-hidden="true" />
        <ChevronDownIcon class="-mr-1 ml-1 h-5 w-4" aria-hidden="true" />
      </MenuButton>
    </div>

    <!-- Timeframe selector options -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems class="timeframe-selector__menu">
        <div class="py-1">
          <MenuItem
            v-for="timeframeKey in timeframeKeys"
            :key="timeframeKey"
            v-slot="{ active }"
          >
            <a
              href="#"
              @click.prevent="timeframe = timeframeKey"
              :class="[
                active
                  ? 'timeframe-selector__option--active'
                  : 'timeframe-selector__option--inactive',
                timeframe === timeframeKey
                  ? 'timeframe-selector__option--selected'
                  : '',
                'timeframe-selector__option',
              ]"
              >{{ timeframeKey }}</a
            >
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<style lang="scss" scoped>
.timeframe-selector {
  @apply relative inline-block text-left;

  &__button {
    @apply inline-flex
      justify-center
      w-full
      shadow-sm
      p-2
      bg-transparent
      text-sm
      font-medium
      border border-transparent
      leading-5
      bg-indigo-400 bg-opacity-25
      text-indigo-100
      placeholder-indigo-200
      hover:bg-indigo-500 hover:bg-opacity-25 hover:text-white
      focus:bg-white focus:bg-opacity-100 focus:text-gray-900 ring-0 outline-none
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

    &--selected {
      @apply bg-indigo-500 text-white font-medium;
    }
  }
}
</style>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { Timeframe } from '@/services/timeframe';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { defineComponent } from '@vue/runtime-core';
import { CalendarIcon, ChevronDownIcon } from 'heroicons-vue3/outline';

export default defineComponent({
  components: {
    Menu,
    MenuItem,
    MenuItems,
    MenuButton,
    ChevronDownIcon,
    CalendarIcon,
  },
  setup() {
    const timeframeKeys: Timeframe[] = [
      Timeframe.DAY,
      Timeframe.WEEK,
      Timeframe.MONTH,
      Timeframe.YEAR,
      Timeframe.ALL,
    ];
    const { timeframe } = useNear();

    return {
      timeframe,
      timeframeKeys,
    };
  },
});
</script>
