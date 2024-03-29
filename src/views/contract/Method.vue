<template>
  <div class="w-full max-w-sm px-4">
    <NormalButton @click="isModalOpen = true">
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
    </NormalButton>

    <Modal
      :open="isModalOpen"
      title="Call Contract"
      @close="isModalOpen = false"
    >
      <h3 class="text-lg mb-3">
        <code>{{ methodName }}</code>
      </h3>
      <Alert v-if="viewError" class="bg-red-50 mb-3">
        <template #icon>
          <XCircleIcon class="w-5 h-5 text-red-600" aria-hidden="true" />
        </template>
        <template #default>
          <h4 class="text-red-800 font-medium">Transaction Execution Error</h4>
          <p class="text-red-700">Error calling view method</p>
          <p
            class="
              mt-2
              text-red-700
              bg-gray-400 bg-opacity-10
              p-2
              border border-gray-300
              rounded-sm
              font-mono
              whitespace-pre
              max-w-sm
              overflow-x-auto
              custom-scrollbar
            "
          >
            {{ viewError }}
          </p>
        </template>
      </Alert>
      <div class="mb-3 flex flex-wrap gap-3 justify-end items-start">
        <output
          v-if="viewResult.length > 0"
          class="
            font-mono
            p-2
            bg-gray-200
            border border-gray-300
            rounded-sm
            whitespace-pre
          "
          >{{ viewResult }}</output
        >
        <SmallPrimaryButton class="w-24" @click="view">View</SmallPrimaryButton>
      </div>
      <div class="flex flex-wrap gap-3 justify-end items-start">
        <Labeled label="Deposit">
          <SmallTextInput
            v-model="depositValue"
            theme="light"
            class="w-28"
            placeholder="10e18"
          />
        </Labeled>
        <Labeled label="Units">
          <SmallSelectInput
            v-model="depositUnits"
            @change="updateValueWithUnits"
            theme="light"
            class="w-32"
            :options="[
              { label: 'NEAR', value: 'near' },
              { label: 'yoctoNEAR', value: 'yocto' },
            ]"
          />
        </Labeled>
        <SmallPrimaryButton
          class="w-24"
          :disabled="!walletAuth.isSignedIn || !walletAuth.isAccessible"
          @click="call"
          >Call</SmallPrimaryButton
        >
      </div>
      <div class="gap-5 flex flex-col p-2 md:min-w-[600px]">
        <div
          v-if="suggestedArguments.length > 0"
          class="flex gap-3 items-center"
        >
          <h4>Suggested Arguments</h4>
          <HelpTooltip>
            <p>This schema conforms to {{ label }}.</p>
          </HelpTooltip>
        </div>
        <ArgumentRow
          v-for="arg in suggestedArguments"
          :key="arg.name"
          locked
          v-model:active="argModels.get(arg.name).active"
          :field="arg.name"
          v-model:type="argModels.get(arg.name).type"
          v-model:value="argModels.get(arg.name).value"
        />
        <div class="flex gap-3 items-center">
          <h4>Arguments</h4>
          <HelpTooltip>
            <p>Specify an arguments schema.</p>
          </HelpTooltip>
        </div>
        <template v-for="arg in customArguments" :key="arg.uniqueId">
          <ArgumentRow
            v-model:active="arg.model.active"
            v-model:field="arg.name"
            v-model:type="arg.model.type"
            v-model:value="arg.model.value"
            @remove="removeCustomArgument(arg)"
          />
        </template>
        <div class="flex items-center gap-3">
          <PendingButton
            @click="addCustomArgument"
            class="inline-flex items-center"
          >
            <span>Add Argument</span>&nbsp;
            <PlusIcon class="w-6 h-6" />
          </PendingButton>
          <div class="ml-auto">
            <TransitionBob>
              <CheckIcon
                v-if="guessMethodUsageState === 'success'"
                class="w-6 h-6 text-green-600"
              />
            </TransitionBob>
            <TransitionBob>
              <XIcon
                v-if="guessMethodUsageState === 'error'"
                class="w-6 h-6 text-red-600"
              />
            </TransitionBob>
          </div>
          <PendingButton
            class="inline-flex items-center"
            @click="guessMethodUsage"
            :mode="guessMethodUsageState === 'pending' ? 'pending' : 'normal'"
          >
            <span>Auto-detect</span>&nbsp;
            <SearchIcon class="w-6 h-6" />
          </PendingButton>
          <HelpTooltip>
            <p>
              Scan the blockchain to find successful method calls and copy the
              parameter schema.
            </p>
            <p>
              <em>Auto-detect might not work on every method!</em>
            </p>
          </HelpTooltip>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import Alert from '@/components/Alert.vue';
import NormalButton from '@/components/form/NormalButton.vue';
import PendingButton from '@/components/form/PendingButton.vue';
import SmallPrimaryButton from '@/components/form/SmallPrimaryButton.vue';
import SmallSelectInput from '@/components/form/SmallSelectInput.vue';
import SmallTextInput from '@/components/form/SmallTextInput.vue';
import HelpTooltip from '@/components/HelpTooltip.vue';
import Modal from '@/components/Modal.vue';
import TransitionBob from '@/components/transitions/TransitionBob.vue';
import { useNear } from '@/composables/useNear';
import { getType, GuessableTypeString, guessType } from '@/utils/guessType';
import Big from 'big.js';
import { Buffer } from 'buffer';
import {
  CheckIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  XCircleIcon,
  XIcon,
} from 'heroicons-vue3/solid';
import { CodeResult } from 'near-api-js/lib/providers/provider';
import { JsonType, StandardInterfaceArgument } from 'near-contract-parser';
import {
  defineComponent,
  PropType,
  reactive,
  Ref,
  ref,
  toRefs,
  watch,
} from 'vue';
import ArgumentRow from './ArgumentRow.vue';
import Labeled from './Labeled.vue';

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

function jsonTypeToGuessableType(
  type: JsonType | JsonType[],
): GuessableTypeString {
  const best =
    type instanceof Array ? type.find(x => x !== 'null') ?? type[0] : type;

  switch (best) {
    case 'object':
    case 'array':
      return 'json';
    default:
      return best;
  }
}

export default defineComponent({
  components: {
    ChevronRightIcon,
    ArgumentRow,
    SmallPrimaryButton,
    Modal,
    PlusIcon,
    Labeled,
    SmallTextInput,
    SmallSelectInput,
    Alert,
    XCircleIcon,
    SearchIcon,
    PendingButton,
    HelpTooltip,
    TransitionBob,
    CheckIcon,
    XIcon,
    NormalButton,
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
      type: Array as PropType<StandardInterfaceArgument[]>,
      default: () => [],
    },
  },
  setup(props) {
    const { walletAuth, account, connection, indexer } = useNear();
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
          if (!argModels.has(arg.name)) {
            argModels.set(arg.name, {
              type: jsonTypeToGuessableType(arg.type),
              value: '',
              active: true,
            });
          }
        });
      },
      { immediate: true },
    );

    const compileArguments = () => {
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

      return args;
    };

    const view = async () => {
      if (!connection.value) {
        alert('No connection to NEAR');
        return;
      }

      const args = compileArguments();

      try {
        const { result } = (await connection.value.connection.provider.query({
          request_type: 'call_function',
          account_id: account.value,
          method_name: props.methodName,
          args_base64: btoa(JSON.stringify(args)),
          finality: 'final',
        })) as CodeResult;

        const decoded = JSON.parse(Buffer.from(result).toString());

        viewError.value = '';
        viewResult.value = JSON.stringify(decoded, null, 2);
      } catch (e: any) {
        console.error('Error calling view method:', args, e);
        viewResult.value = '';
        viewError.value = e.message;
      }
    };

    const call = () => {
      if (
        !walletAuth.isSignedIn ||
        !walletAuth.isAccessible ||
        !walletAuth.account
      ) {
        // Should never happen; call button is disabled if not signed in
        alert('You must be signed in to call a function.');
        return;
      }

      const args = compileArguments();

      const tryParseDeposit = (() => {
        try {
          const b = Big(depositValue.value);
          if (b.s < 0) {
            return Big(0);
          } else {
            return b;
          }
        } catch (_) {
          return Big(0);
        }
      })();

      // Scale to units of yoctoNEAR
      const depositYocto = tryParseDeposit.times(
        depositUnits.value === 'near' ? Big('1e+24') : 1,
      );

      // Perform function call
      walletAuth.account.functionCall({
        contractId: account.value,
        methodName: props.methodName,
        args,
        attachedDeposit: depositYocto.toFixed(0),
      });
    };

    const guessMethodUsageState = ref<
      'normal' | 'pending' | 'success' | 'error'
    >('normal');
    const guessMethodUsage = async () => {
      guessMethodUsageState.value = 'pending';

      try {
        const [{ args: concreteArgs }] = await indexer.getMethodUsage({
          account: account.value,
          methodName: props.methodName,
        });

        // Sometimes args is an empty string (JSON.parse throws)
        const decoded = concreteArgs.args_base64
          ? JSON.parse(atob(concreteArgs.args_base64))
          : {};
        // Overwrite custom
        customArguments.value = Object.keys(decoded).map(
          key =>
            ({
              name: key,
              uniqueId: uniqueId++,
              model: {
                type: getType(decoded[key]),
                value: '',
                active: true,
              },
            } as ICustomArgModel),
        );

        depositUnits.value = 'yocto';
        depositValue.value = concreteArgs.deposit;

        // Disable suggested
        Array.from(argModels.keys()).forEach(p => {
          argModels.get(p)!.active = false;
        });

        guessMethodUsageState.value = 'success';
      } catch (_) {
        guessMethodUsageState.value = 'error';
        return;
      }
    };

    const viewResult = ref<string>('');
    const viewError = ref<string>('');
    const depositValue = ref<string>('');
    const depositUnits = ref<'near' | 'yocto'>('near');

    const updateValueWithUnits = (
      newValue: 'near' | 'yocto',
      oldValue: 'near' | 'yocto',
    ) => {
      if (newValue !== oldValue) {
        depositValue.value = (() => {
          try {
            const b = Big(depositValue.value);
            if (newValue === 'near') {
              return b.div('1e+24');
            } else {
              return b.mul('1e+24');
            }
          } catch (_) {
            return Big(0);
          }
        })().toString();
      }
    };

    return {
      call,
      view,
      walletAuth,
      isModalOpen,
      argModels,
      customArguments,
      addCustomArgument,
      removeCustomArgument,
      guessMethodUsage,
      guessMethodUsageState,
      viewResult,
      viewError,
      depositValue,
      depositUnits,
      updateValueWithUnits,
    };
  },
});
</script>
