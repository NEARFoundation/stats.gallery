<template>
  <client-only>
    <Listbox as="div" v-bind="$attrs" v-model="selectedItem">
      <div class="relative">
        <ListboxButton
          class="
            w-full
            bg-white
            cursor-pointer
            relative
            rounded-sm
            p-3
            pr-10
            text-left
            focus:ring-green-500 focus:ring-2 focus:outline-none
            sm:text-sm
          "
        >
          <span class="block truncate text-xl text-black text-center">{{
            selectedItem.text
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
            <SelectorIcon class="h-6 w-6 text-gray-700" aria-hidden="true" />
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
              text-xl
            "
          >
            <ListboxOption
              as="template"
              v-for="timeframe in timeframes"
              :key="timeframe"
              :value="timeframe"
              v-slot="{ active, selected }"
            >
              <li
                :class="[
                  active ? 'text-white bg-green-600' : 'text-gray-900',
                  'cursor-pointer select-none relative py-2 pl-3 pr-9',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'block truncate',
                  ]"
                >
                  {{ timeframe.text }}
                </span>

                <span
                  v-if="selected"
                  :class="[
                    active ? 'text-white' : 'text-green-600',
                    'absolute inset-y-0 right-0 flex items-center pr-4',
                  ]"
                >
                  <CheckIcon class="h-6 w-6" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </client-only>
</template>

<script lang="ts">
import { Timeframe } from '@/services/timeframe';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { CheckIcon, SelectorIcon } from 'heroicons-vue3/outline';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    CheckIcon,
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

    const fallbackTimeframe = timeframes[1];

    const findTimeframe = (search: Timeframe) =>
      timeframes.find(t => t.value === search) ?? fallbackTimeframe;

    const selectedItem = ref(findTimeframe(props.modelValue));

    watch(selectedItem, selectedItem => {
      emit('update:modelValue', selectedItem.value);
    });

    return {
      timeframes,
      selectedItem,
    };
  },
});
</script>
