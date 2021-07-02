<template>
  <div
    :class="{
      'animate-pulse': isLoading,
    }"
    class="relative flex space-x-3"
  >
    <div
      v-if="isLoading"
      class="rounded-full h-8 bg-gray-200 w-8 ring-8 ring-white"
    ></div>
    <TransactionActionIcon
      v-else
      :actionKind="action.action_kind"
      :direction="
        action.receiver_account_id === account ? 'receiver' : 'sender'
      "
      #default="{ component, color }"
    >
      <span
        :class="[
          color,
          'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
        ]"
      >
        <component
          :is="component"
          class="h-5 w-5 text-white"
          aria-hidden="true"
        />
      </span>
    </TransactionActionIcon>
    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
      <div v-if="isLoading" class="rounded-md h-4 bg-gray-200 w-1/2"></div>
      <p v-else class="text-sm text-gray-500">
        <button
          class="cursor-pointer font-medium text-gray-900"
          @click="setAccount(action.signer_account_id)"
        >
          {{ action.signer_account_id }}
        </button>
        {{ action.action_kind }}
        <button
          class="cursor-pointer font-medium text-gray-900"
          @click="setAccount(action.receiver_account_id)"
        >
          {{ action.receiver_account_id }}
        </button>
      </p>
      <div class="text-right text-sm whitespace-nowrap text-gray-500">
        <div v-if="isLoading" class="rounded-md h-4 bg-gray-200 w-36"></div>
        <time
          v-else
          :datetime="$filters.nearTimestampToISO(action.block_timestamp)"
          >{{
            $filters.nearTimestampToLocaleString(
              action.block_timestamp,
              DateTime.DATETIME_FULL,
            )
          }}</time
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { UnifiedTransactionAction } from '@/services/near/types';
import { useNear } from '@/services/useNear';
import { DateTime } from 'luxon';
import { defineComponent } from 'vue';
import TransactionActionIcon from './TransactionActionIcon.vue';

export default defineComponent({
  components: { TransactionActionIcon },
  props: {
    action: {
      type: Object as () => UnifiedTransactionAction,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { account } = useNear();

    const setAccount = (newAccount: string) => {
      account.value = newAccount;
    };

    return {
      DateTime,
      setAccount,
    };
  },
});
</script>
