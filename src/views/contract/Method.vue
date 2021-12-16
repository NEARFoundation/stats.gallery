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
        dark:text-white
        bg-gray-100
        dark:bg-gray-700
        hover:dark:bg-gray-600
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
        class="
          w-5
          h-5
          ml-2
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
          <code>{{ methodName }}</code>
        </h4>
        <SmallPrimaryButton class="w-24">View</SmallPrimaryButton>
        <SmallPrimaryButton class="w-24" @click="call">Call</SmallPrimaryButton>
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
        <p>Custom</p>
        <template v-for="arg in customArguments" :key="arg.uniqueId">
          <ArgumentRow
            v-model:active="arg.model.active"
            v-model:field="arg.name"
            v-model:type="arg.model.type"
            v-model:value="arg.model.value"
            @remove="removeCustomArgument(arg)"
          />
        </template>
        <div>
          <button
            @click="addCustomArgument"
            class="
              flex
              items-center
              py-2
              px-4
              text-gray-800
              bg-gray-100
              hover:bg-gray-200
              border border-gray-300
              rounded-sm
            "
          >
            <span>Add</span>
            <PlusIcon class="w-6 h-6" />
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import SmallPrimaryButton from '@/components/form/SmallPrimaryButton.vue';
import Modal from '@/components/Modal.vue';
import { GuessableTypeString, guessType } from '@/utils/guessType';
import { ChevronRightIcon } from 'heroicons-vue3/solid';
import { defineComponent, PropType, reactive, ref, toRefs, watch } from 'vue';
import ArgumentRow from './ArgumentRow.vue';
import { PlusIcon } from 'heroicons-vue3/solid';

interface IArgModel {
  type: GuessableTypeString | 'auto';
  value: string;
  active: boolean;
}

interface ICustomArgModel {
  name: string;
  uniqueId: number;
  model: IArgModel;
}

const strToType = (str: string, type: GuessableTypeString): unknown => {
  switch (type) {
    case 'json':
      return JSON.parse(str);
    case 'number':
      return Number(str);
    case 'boolean':
      return (
        str.trim().length > 0 && !['false', '0'].includes(str.toLowerCase())
      );
    case 'null':
      return null;
    default:
      return str + '';
  }
};

export default defineComponent({
  components: {
    ChevronRightIcon,
    ArgumentRow,
    SmallPrimaryButton,
    Modal,
    PlusIcon,
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
    let uniqueId = 0;
    const isModalOpen = ref(false);

    const customArguments = ref<ICustomArgModel[]>([]);

    const addCustomArgument = () => {
      customArguments.value = [
        ...customArguments.value,
        {
          name: '',
          uniqueId: uniqueId++,
          model: {
            type: 'auto',
            value: '',
            active: true,
          },
        },
      ];
    };

    const removeCustomArgument = (arg: ICustomArgModel) => {
      customArguments.value = customArguments.value.filter(x => x !== arg);
    };

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

    const call = () => {
      // Construct args object
      const args: Record<string, any> = {};

      for (const [argName, model] of argModels.entries()) {
        if (model.active) {
          args[argName] =
            model.type === 'auto'
              ? guessType(model.value).value
              : strToType(model.value, model.type);
        }
      }

      // In the case of name conflict, custom args override suggested
      for (const arg of customArguments.value) {
        if (arg.model.active) {
          args[arg.name] =
            arg.model.type === 'auto'
              ? guessType(arg.model.value).value
              : strToType(arg.model.value, arg.model.type);
        }
      }

      console.log({ args });
      // await walletAuth.account?.functionCall({
      //   contractId: account.value,
      //   methodName: props.methodName,
      //   args: {},
      //   attachedDeposit: 1,
      // }),
    };

    return {
      call,
      isModalOpen,
      argModels,
      customArguments,
      addCustomArgument,
      removeCustomArgument,
    };
  },
});
</script>
