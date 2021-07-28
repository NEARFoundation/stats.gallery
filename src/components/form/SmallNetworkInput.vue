<template>
  <Listbox as="div" v-model="selected">
    <div class="relative">
      <ListboxButton
        class="
          w-full
          bg-white
          cursor-pointer
          relative
          rounded-sm
          p-2
          pr-8
          text-left
          focus:ring-green-500 focus:ring-2 focus:outline-none
          border border-gray-300
          flex
          items-center
        "
      >
        <span
          :aria-label="selected.connected ? 'Connected' : 'Disconnected'"
          :class="[
            selected.connected ? 'bg-green-400' : 'bg-gray-400',
            'flex-shrink-0 inline-block h-2 w-2 rounded-full mr-2 absolute',
          ]"
        />
        <span
          class="block truncate text-base text-black flex-grow text-center"
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
          <SelectorIcon class="h-5 w-5 text-gray-700" aria-hidden="true" />
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
                'cursor-pointer select-none relative py-2 pl-2 pr-9 flex items-center',
              ]"
            >
              <span
                :class="[
                  network.connected ? 'bg-green-400' : 'bg-gray-400',
                  'flex-shrink-0 inline-block h-2 w-2 rounded-full mr-2',
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
                  'absolute inset-y-0 right-0 flex items-center pr-3',
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
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
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'network-input',
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
  setup() {
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

    const selected = ref(networks[0]);

    return {
      networks,
      selected,
    };
  },
});
</script>
