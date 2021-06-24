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
          {{ transaction.action_kind }}
          <a href="#" class="font-medium text-gray-900">{{
            transaction.receiver_account_id
          }}</a>
        </p>
      </div>
      <div class="text-right text-sm whitespace-nowrap text-gray-500">
        <time :datetime="transaction.block_timestamp / 1000000">{{
          $filters.nearTimestampToLocaleString(
            transaction.block_timestamp,
            DateTime.DATETIME_FULL,
          )
        }}</time>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { UnifiedTransactionAction } from '@/services/near/types';
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
    return {
      DateTime,
    };
  },
});
</script>
