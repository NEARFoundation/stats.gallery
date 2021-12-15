<template>
  <div class="w-full max-w-sm px-4">
    <button
      @click="isModalOpen = true"
      :class="isModalOpen ? '' : 'text-opacity-90'"
      class="
        inline-flex
        items-center
        px-3
        py-2
        text-base
        font-medium
        text-white
        bg-gray-600 bg-opacity-30
        rounded-sm
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
    </button>

    <Modal
      :open="isModalOpen"
      title="Call Contract"
      @close="isModalOpen = false"
    >
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
    </Modal>
  </div>
</template>

<script lang="ts">
import SmallPrimaryButton from '@/components/form/SmallPrimaryButton.vue';
import Modal from '@/components/Modal.vue';
import { GuessableTypeString } from '@/utils/guessType';
import { ChevronRightIcon } from 'heroicons-vue3/solid';
import { defineComponent, PropType, reactive, ref, toRefs, watch } from 'vue';
import ArgumentRow from './ArgumentRow.vue';

export default defineComponent({
  components: {
    ChevronRightIcon,
    ArgumentRow,
    SmallPrimaryButton,
    Modal,
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
    const isModalOpen = ref(false);

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
      isModalOpen,
      argModels,
    };
  },
});
</script>
