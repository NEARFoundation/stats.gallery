<template>
  <div class="relative flex space-x-3">
    <div>
      <TransactionActionIcon
        :actionKind="transaction.action_kind"
        :direction="
          transaction.receiver_account_id === account ? 'receiver' : 'sender'
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
    </div>
    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
      <div>
        <p class="text-sm text-gray-500">
          <button
            class="cursor-pointer font-medium text-gray-900"
            @click="setAccount(transaction.signer_account_id)"
          >
            {{ transaction.signer_account_id }}
          </button>
          {{ transaction.action_kind }}
          <button
            class="cursor-pointer font-medium text-gray-900"
            @click="setAccount(transaction.receiver_account_id)"
          >
            {{ transaction.receiver_account_id }}
          </button>
        </p>
      </div>
      <div class="text-right text-sm whitespace-nowrap text-gray-500">
        <time
          :datetime="$filters.nearTimestampToISO(transaction.block_timestamp)"
          >{{
            $filters.nearTimestampToLocaleString(
              transaction.block_timestamp,
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
import { nearContext } from '@/utils/near';
import { DateTime } from 'luxon';
import { defineComponent } from 'vue';
import TransactionActionIcon from './TransactionActionIcon.vue';

export default defineComponent({
  components: { TransactionActionIcon },
  props: {
    transaction: {
      type: Object as () => UnifiedTransactionAction,
      required: true,
    },
    account: {
      type: String,
      require: true,
    },
  },
  setup() {
    const { account } = nearContext();

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
