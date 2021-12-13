<template>
  <div class="w-full max-w-sm px-4">
    <Popover v-slot="{ open }">
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
          bg-gray-600 bg-opacity-30
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
          class="z-10 px-4 mt-2 absolute left-0 lg:-ml-4 lg:left-auto lg:w-auto"
        >
          <div class="shadow-lg bg-gray-900 rounded-md p-3">
            <div class="mb-3 flex space-x-3 items-center">
              <h4 class="text-lg flex-grow">
                Method: <code>{{ methodName }}</code>
              </h4>
              <SmallPrimaryButton class="w-24">View</SmallPrimaryButton>
              <SmallPrimaryButton class="w-24">Call</SmallPrimaryButton>
            </div>
            <div class="gap-5 flex flex-col p-2">
              <p>Default</p>
              <ArgumentRow
                v-for="arg in suggestedArguments"
                :key="arg"
                locked
                v-model:active="argModels.get(arg).active"
                :field="arg"
                v-model:type="argModels.get(arg).type"
                v-model:value="argModels.get(arg).value"
              />
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </div>
</template>

<script lang="ts">
import SmallPrimaryButton from '@/components/form/SmallPrimaryButton.vue';
import { GuessableTypeString } from '@/utils/guessType';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { ChevronRightIcon } from 'heroicons-vue3/solid';
import { defineComponent, PropType, reactive, toRefs, watch } from 'vue';
import ArgumentRow from './ArgumentRow.vue';

export default defineComponent({
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
    ChevronRightIcon,
    ArgumentRow,
    SmallPrimaryButton,
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
  setup(props) {
    interface IArgModel {
      type: GuessableTypeString | 'auto';
      value: string;
      active: boolean;
    }

    const argModels = reactive(new Map<string, IArgModel>());

    watch(
      toRefs(props).suggestedArguments,
      suggestedArguments => {
        suggestedArguments.forEach(arg => {
          if (!argModels.has(arg)) {
            argModels.set(arg, {
              type: 'auto',
              value: '',
              active: true,
            });
          }
        });
      },
      { immediate: true },
    );

    return {
      argModels,
      log: console.log.bind(console),
    };
  },
});
</script>
