<template>
  <main class="flex-grow flex flex-col space-y-3">
    <DashboardCard title="Contract Interactions">
      <div class="flex flex-col space-y-3 p-3">
        <h3 class="font-normal">Interfaces</h3>
        <ul class="flex flex-col mx-3">
          <li
            v-for="interfaceId in contract.probableInterfaces"
            :key="interfaceId"
            class="m-1 px-4 py-2 font-medium rounded-full"
          >
            <div>{{ interfaces[interfaceId].name }}</div>
            <div class="space-y-2 mt-2">
              <Method
                v-for="method in interfaces[interfaceId].methods"
                :key="method.name"
                :methodName="method.name"
                :suggestedArguments="method.args"
              />
            </div>
          </li>
        </ul>
        <h3 class="font-normal">Contract Methods</h3>
        <div class="flex flex-col bg-gray-800 divide-y divide-gray-700">
          <div
            v-for="methodName in contract.methodNames"
            :key="methodName"
            class="grid grid-cols-4 py-3"
          >
            <div class="col-span-1">
              <code
                class="
                  bg-gray-200
                  dark:bg-gray-900
                  truncate
                  max-w-xs
                  px-1
                  font-mono
                  rounded
                  text-gray-500
                  dark:text-gray-300
                  text-sm
                "
                >{{ methodName }}</code
              >
            </div>
            <div class="col-span-2 flex flex-col">
              <div
                v-for="interfaceId in contract.byMethod[methodName]"
                :key="interfaceId"
              >
                {{ interfaces[interfaceId].name }}
              </div>
            </div>
            <div class="col-span-1"></div>
            <div class="col-span-full mt-2 space-y-1 flex flex-col">
              <div class="flex flex-row">
                <div class="w-1/2">
                  <input
                    class="bg-gray-900"
                    type="text"
                    disabled
                    value="Argument 1"
                  />
                </div>
                <div class="w-1/2">
                  <input
                    class="bg-gray-900"
                    type="text"
                    disabled
                    value="Value 1"
                  />
                </div>
              </div>
              <div class="flex flex-row">
                <div class="w-1/2">
                  <input
                    class="bg-gray-900"
                    type="text"
                    disabled
                    value="Argument 2"
                  />
                </div>
                <div class="w-1/2">
                  <input
                    class="bg-gray-900"
                    type="text"
                    disabled
                    value="Value 2"
                  />
                </div>
              </div>
            </div>
            <div class="col-span-3"></div>
            <div class="col-span-1">
              <button class="px-3 py-2 bg-blue-700 rounded-md">Run</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  </main>
  <Modal
    :open="isTransactionResultsModalOpen"
    @close="closeTransactionResultsModal"
    title="Transaction Results"
  >
    <Alert v-if="errorCode" class="bg-red-50">
      <template #icon>
        <XCircleIcon class="w-5 h-5 text-red-600" aria-hidden="true" />
      </template>
      <template #default>
        <h3 class="text-red-800 font-medium">Transaction Execution Error</h3>
        <p class="text-red-700">{{ errorCode }}</p>
        <p
          class="
            mt-2
            text-red-700
            bg-gray-400 bg-opacity-10
            p-2
            border border-gray-300
            rounded-sm
            font-mono
            whitespace-nowrap
            max-w-sm
            overflow-x-auto
            custom-scrollbar
          "
        >
          {{ errorMessage }}
        </p>
      </template>
    </Alert>
    <TransactionResult
      v-for="hash in transactionHashes"
      :key="hash"
      :hash="hash"
    />
  </Modal>
</template>

<script lang="ts">
import Alert from '@/components/Alert.vue';
import Modal from '@/components/Modal.vue';
import { interfaces } from '@/composables/contract/interfaces';
import { useContract } from '@/composables/contract/useContract';
import { useNear } from '@/composables/useNear';
import { useTransactionResultFromUrl } from '@/composables/useTransactionResultFromUrl';
import { XCircleIcon } from 'heroicons-vue3/solid';
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Method from './contract/Method.vue';
import TransactionResult from './contract/TransactionResult.vue';
import DashboardCard from './overview/DashboardCard.vue';

export default defineComponent({
  components: {
    Alert,
    DashboardCard,
    Method,
    Modal,
    TransactionResult,
    XCircleIcon,
  },
  setup() {
    const { account, network } = useNear();
    const { contract, isLoading } = useContract({ account, network });
    const args = reactive(new Map<string, { name: string; value: string }>());

    const { transactionHashes, errorMessage, errorCode } =
      useTransactionResultFromUrl();

    // Saved so that the values don't disappear immediately upon modal close
    const savedTransactionHashes = ref<string[]>([]);
    const savedErrorMessage = ref<string>();
    const savedErrorCode = ref<string>();
    watch(
      [transactionHashes, errorMessage, errorCode],
      ([hashes, errorMessage, errorCode]) => {
        if (hashes.length > 0) {
          savedTransactionHashes.value = hashes;
        }

        if (errorMessage) {
          savedErrorMessage.value = decodeURIComponent(errorMessage);
        }

        if (errorCode) {
          savedErrorCode.value = errorCode;
        }
      },
      { immediate: true },
    );

    const isTransactionResultsModalOpen = computed(
      () => transactionHashes.value.length > 0 || !!errorCode.value,
    );
    const router = useRouter();
    const closeTransactionResultsModal = async () => {
      await router.push({
        name: 'contract',
      });
    };

    return {
      isTransactionResultsModalOpen,
      closeTransactionResultsModal,
      transactionHashes: savedTransactionHashes,
      errorMessage: savedErrorMessage,
      errorCode: savedErrorCode,
      contract,
      isLoading,
      interfaces,
      args,
    };
  },
});
</script>
