<template>
  <div class="w-full max-w-sm px-4">
    <Popover v-slot="{ open }" class="relative">
      <PopoverButton
        :class="open ? '' : 'text-opacity-90'"
        class="
          inline-flex
          items-center
          px-3
          py-2
          text-base
          font-medium
          text-white
          bg-orange-700
          rounded-md
          group
          hover:text-opacity-100
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-white
          focus-visible:ring-opacity-75
        "
      >
        <span>{{ methodName }}</span>
        <ChevronRightIcon
          :class="open ? '' : 'text-opacity-70'"
          class="
            w-5
            h-5
            ml-2
            text-orange-300
            transition
            duration-150
            ease-in-out
            group-hover:text-opacity-80
          "
          aria-hidden="true"
        />
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
            z-10
            w-screen
            max-w-sm
            px-4
            mt-3
            transform
            -translate-x-1/2
            left-1/2
            sm:px-0
            lg:max-w-3xl
          "
        >
          <div
            class="
              overflow-hidden
              rounded-lg
              shadow-lg
              ring-1 ring-black ring-opacity-5
            "
          >
            <div class="relative grid gap-8 bg-white p-7 lg:grid-cols-2"></div>
            <div class="p-4 bg-gray-50">
              <a
                href="##"
                class="
                  flow-root
                  px-2
                  py-2
                  transition
                  duration-150
                  ease-in-out
                  rounded-md
                  hover:bg-gray-100
                  focus:outline-none
                  focus-visible:ring
                  focus-visible:ring-orange-500
                  focus-visible:ring-opacity-50
                "
              >
                <span class="flex items-center">
                  <span class="text-sm font-medium text-gray-900">
                    Documentation
                  </span>
                </span>
                <span class="block text-sm text-gray-500">
                  Start integrating products and tools
                </span>
              </a>
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { ChevronRightIcon } from 'heroicons-vue3/solid';

export default defineComponent({
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
    ChevronRightIcon,
  },
  props: {
    methodName: {
      type: String as PropType<string>,
      required: true,
    },
    label: {
      type: String as PropType<string>,
      default: () => '',
    },
    suggestedArguments: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup() {
    return {};
  },
});
</script>
