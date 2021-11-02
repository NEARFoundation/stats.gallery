<template>
  <Listbox
    as="div"
    class="relative"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  >
    <ListboxButton class="w-full" v-slot="{ open }">
      <div
        v-if="label.length > 0"
        class="text-xs text-gray-500 dark:text-gray-200 text-left pb-1 px-1"
      >
        {{ label }}
      </div>
      <div
        :class="[
          open || highlight(modelValue)
            ? 'bg-gray-500 text-gray-100 dark:bg-gray-900'
            : 'bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500',
        ]"
        class="
          w-full
          flex
          items-center
          justify-between
          text-sm
          font-medium
          py-1
          px-3
          rounded-md
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-gray-500
          cursor-pointer
        "
      >
        {{ display(modelValue) }}
        <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </div>
    </ListboxButton>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <ListboxOptions
        class="
          absolute
          z-10
          mt-1
          w-full
          bg-white
          shadow-lg
          max-h-60
          rounded-sm
          py-1
          ring-1 ring-black ring-opacity-5
          overflow-auto
          focus:outline-none
          text-sm
          dark:bg-gray-700
          custom-scrollbar
        "
      >
        <ListboxOption
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          v-slot="{ active }"
        >
          <div
            :class="[
              active ? 'bg-gray-100 dark:bg-gray-800' : '',
              'cursor-pointer select-none relative py-2 px-3',
            ]"
          >
            {{ display(item) }}
          </div>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<script lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { ref } from '@vue/reactivity';
import { defineComponent, PropType } from '@vue/runtime-core';
import { ChevronDownIcon } from 'heroicons-vue3/solid';

export default defineComponent({
  components: {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    ChevronDownIcon,
  },
  props: {
    modelValue: {
      type: Object as PropType<any>,
    },
    label: {
      type: String as PropType<string>,
      default: '',
    },
    items: {
      type: Array as PropType<string[]>,
      required: true,
    },
    display: {
      type: Function as PropType<(e: any) => string>,
      default: (e: any) => e + '',
    },
    highlight: {
      type: Function as PropType<(e: any) => boolean>,
      default: (e: any) => false,
    },
  },
  emits: ['update:modelValue'],
});
</script>
