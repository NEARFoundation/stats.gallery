<template>
  <Popover v-slot="{ open }" class="sm:relative">
    <PopoverButton>
      <slot name="trigger" :open="open" />
    </PopoverButton>
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel
        class="
          absolute
          sm:top-full
          left-0
          sm:left-1/2 sm:transform sm:-translate-x-1/2
          z-10
          w-full
          sm:w-screen
          mt-1
          sm:max-w-sm
        "
      >
        <div
          class="
            overflow-hidden
            rounded-md
            shadow-lg
            bg-gray-900 bg-opacity-80
            backdrop-filter backdrop-blur-sm
            text-white
            p-3
            mx-4
            sm:mx-0
          "
        >
          <slot name="content" :open="open" />
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
  },
});
</script>
