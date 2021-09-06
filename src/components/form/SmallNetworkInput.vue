<template>
  <client-only>
    <Listbox as="div" v-bind="$attrs" v-model="selected">
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
            text-left
            focus:ring-green-500 focus:ring-2 focus:outline-none
            border border-gray-300
            flex
            items-center
            dark:bg-gray-700
            dark:hover:bg-gray-800
            dark:border-gray-600
            dark:text-white
          "
        >
          <span
            :aria-label="selected.connected ? 'Connected' : 'Disconnected'"
            :class="[
              selected.connected ? 'bg-green-400' : 'bg-gray-400',
              'flex-shrink-0 inline-block h-2 w-2 rounded-full mr-2',
            ]"
          />
          <span
            class="
              block
              truncate
              text-base text-black
              dark:text-white
              flex-grow
            "
            >{{ selected.text }}</span
          >
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
              v-for="network in networks"
              :key="network"
              :value="network"
              v-slot="{ active }"
            >
              <li
                :class="[
                  active ? 'bg-gray-100 dark:bg-gray-800' : '',
                  'cursor-pointer select-none relative py-2 pl-3 pr-9 flex items-center',
                ]"
              >
                <span
                  :class="[
                    network.connected ? 'bg-green-400' : 'bg-gray-400',
                    'flex-shrink-0 inline-block h-2 w-2 rounded-full mr-2',
                  ]"
                  aria-hidden="true"
                />

                <span class="block truncate">
                  {{ network.text }}
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
import { Network } from '@/services/near/indexer/networks';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { SelectorIcon } from 'heroicons-vue3/outline';
import { defineComponent, ref, toRefs, watch } from 'vue';

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
      type: String as () => Network,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const networks = [
      {
        text: 'mainnet',
        value: Network.MAINNET,
        connected: true,
      },
      {
        text: 'testnet',
        value: Network.TESTNET,
        connected: false,
      },
    ];

    const selected = ref(
      networks.find(network => network.value === props.modelValue),
    );

    watch(toRefs(props).modelValue, modelValue => {
      selected.value = networks.find(network => network.value === modelValue);
    });

    watch(selected, selected => {
      emit('update:modelValue', selected?.value);
    });

    return {
      networks,
      selected,
    };
  },
});
</script>
