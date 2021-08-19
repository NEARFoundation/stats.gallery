<template>
  <Listbox as="div" v-model="selected">
    <div class="relative">
      <ListboxButton
        class="
          w-full
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
          selected.text
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
            v-for="timeframe in timeframes"
            :key="timeframe"
            :value="timeframe"
            v-slot="{ active }"
          >
            <li
              :class="[
                active ? 'bg-gray-100 dark:bg-gray-800' : '',
                'cursor-pointer select-none relative py-2 px-3',
              ]"
            >
              <span class="block truncate">
                {{ timeframe.text }}
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script lang="ts">
import { Timeframe } from '@/services/timeframe';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { SelectorIcon } from 'heroicons-vue3/outline';
import { defineComponent, ref, toRef, toRefs, watch } from 'vue';

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
      type: String as () => Timeframe,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const timeframes = [
      {
        text: 'day',
        value: Timeframe.DAY,
      },
      {
        text: 'week',
        value: Timeframe.WEEK,
      },
      {
        text: 'month',
        value: Timeframe.MONTH,
      },
      {
        text: 'year',
        value: Timeframe.YEAR,
      },
      {
        text: 'all',
        value: Timeframe.ALL,
      },
    ];

    const selected = ref(timeframes.find(t => t.value === props.modelValue)!);

    watch(toRefs(props).modelValue, modelValue => {
      selected.value = timeframes.find(t => t.value === modelValue)!;
    });

    watch(selected, () => {
      emit('update:modelValue', selected.value.value);
    });

    return {
      timeframes,
      selected,
    };
  },
});
</script>
