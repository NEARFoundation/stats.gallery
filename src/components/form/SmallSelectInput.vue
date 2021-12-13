<template>
  <client-only>
    <Listbox
      as="div"
      v-bind="$attrs"
      class="relative"
      :modelValue="selectedOption"
      @update:modelValue="$emit('update:modelValue', $event.value)"
    >
      <ListboxButton
        class="
          w-full
          h-full
          bg-white
          hover:bg-gray-100
          cursor-pointer
          relative
          rounded-sm
          p-2
          pl-3
          pr-8
          border border-gray-300
          text-left
          focus:ring-green-500 focus:ring-2 focus:outline-none
          dark:bg-gray-700
          dark:hover:bg-gray-800
          dark:border-gray-600
          dark:text-white
        "
      >
        <span class="block truncate text-base text-black dark:text-white">{{
          selectedOption.label
        }}</span>
        <span
          class="
            absolute
            inset-y-0
            right-0
            flex
            items-center
            pr-2
            pointer-events-none
          "
        >
          <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
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
            text-base
            dark:bg-gray-700
          "
        >
          <ListboxOption
            as="template"
            v-for="option in options"
            :key="option.value"
            :value="option"
            v-slot="{ active }"
          >
            <li
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-800' : '',
                'cursor-pointer select-none relative py-2 px-3',
              ]"
            >
              <span class="block truncate">
                {{ option.label }}
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
  </client-only>
</template>

<script lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { SelectorIcon } from 'heroicons-vue3/outline';
import { computed, defineComponent, PropType } from 'vue';

export default defineComponent({
  components: {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    SelectorIcon,
  },
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
    options: {
      type: Array as PropType<{ label: string; value: string }[]>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props) {
    const selectedOption = computed(() =>
      props.options.find(o => o.value === props.modelValue),
    );
    return {
      selectedOption,
    };
  },
});
</script>
