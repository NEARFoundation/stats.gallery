<template>
  <main class="flex-grow flex flex-col space-y-3">
    <DashboardCard title="Contract Interactions">
      <div class="flex flex-col space-y-3 p-3">
        <Alert v-if="!accountIsContract" class="bg-red-50">
          <template #icon>
            <XCircleIcon class="w-5 h-5 text-red-600" aria-hidden="true" />
          </template>
          <template #default>
            <h3 class="text-red-800 font-medium">Not a contract</h3>
            <p class="text-red-700">
              The account {{ account }} does not have a contract deployed.
            </p>
          </template>
        </Alert>
        <template v-else>
          <template v-if="contract.probableInterfaces.length > 0">
            <h3 class="font-medium text-lg">Standard Interfaces</h3>
            <ul class="flex flex-col mx-3">
              <li
                v-for="interfaceId in contract.probableInterfaces"
                :key="interfaceId"
                class="m-1 px-4 py-2 font-medium rounded-sm border-l-4"
                :style="{
                  'border-color': getDeterministicHueColor(
                    interfaceId,
                    100,
                    40,
                  ),
                }"
              >
                <div>{{ interfaces[interfaceId].name }}</div>
                <div class="space-y-2 mt-2">
                  <Method
                    v-for="method in interfaces[interfaceId].methods"
                    :key="method.name"
                    :methodName="method.name"
                    :suggestedArguments="method.args"
                    :label="interfaces[interfaceId].name"
                  />
                </div>
              </li>
            </ul>
          </template>
          <h3 class="font-medium text-lg">Contract Methods</h3>
          <div class="flex flex-col gap-3">
            <Method
              v-for="methodName in contract.methodNames"
              :key="methodName"
              :methodName="methodName"
            />
          </div>
        </template>
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
    <h3
      v-if="transactionHashes.length > 0"
      class="inline-flex items-center gap-2 font-medium mb-1"
    >
      <span>Successful</span>
      <CheckCircleIcon class="w-5 h-5 text-green-600" aria-hidden="true" />
    </h3>
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
import { useContract } from '@/composables/contract/useContract';
import { useNear } from '@/composables/useNear';
import { useTransactionResultFromUrl } from '@/composables/useTransactionResultFromUrl';
import { getDeterministicHueColor } from '@/utils/deterministicColor';
import { isContract } from '@/utils/near';
import { CheckCircleIcon, XCircleIcon } from 'heroicons-vue3/solid';
import { interfaces } from 'near-contract-parser';
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
    CheckCircleIcon,
  },
  setup() {
    const { account, network, accountView } = useNear();
    const accountIsContract = computed(() =>
      isContract(accountView.value.code_hash),
    );
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
      account,
      isTransactionResultsModalOpen,
      accountIsContract,
      closeTransactionResultsModal,
      transactionHashes: savedTransactionHashes,
      errorMessage: savedErrorMessage,
      errorCode: savedErrorCode,
      contract,
      isLoading,
      interfaces,
      args,
      getDeterministicHueColor,
    };
  },
});
</script>
