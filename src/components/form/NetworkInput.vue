<template>
  <client-only>
    <Listbox as="div" v-model="selected">
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
            flex
            items-center
          "
        >
          <span
            :aria-label="selected.connected ? 'Connected' : 'Disconnected'"
            :class="[
              selected.connected ? 'bg-green-400' : 'bg-gray-400',
              'flex-shrink-0 inline-block h-3 w-3 rounded-full mr-3',
            ]"
          />
          <span
            class="block truncate text-xl text-black text-center flex-grow"
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
              v-for="network in networks"
              :key="network"
              :value="network"
              v-slot="{ active, selected }"
            >
              <li
                :class="[
                  active ? 'text-white bg-green-600' : 'text-gray-900',
                  'cursor-pointer select-none relative py-2 pl-3 pr-9 flex items-center',
                ]"
              >
                <span
                  :class="[
                    network.connected ? 'bg-green-400' : 'bg-gray-400',
                    'flex-shrink-0 inline-block h-3 w-3 rounded-full mr-3',
                  ]"
                  aria-hidden="true"
                />

                <span
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'block truncate',
                  ]"
                >
                  {{ network.text }}
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
import { Network } from '@/services/near/indexer/networks';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { CheckIcon, SelectorIcon } from 'heroicons-vue3/outline';
import { defineComponent, ref, toRefs, watch } from 'vue';

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
