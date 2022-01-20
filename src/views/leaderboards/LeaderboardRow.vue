<template>
  <div class="py-2 relative flex">
    <div
      class="w-1/12 hidden sm:block text-center px-2 font-bold text-gray-300"
    >
      {{ rank }}
    </div>
    <div class="flex-1 truncate px-2">
      <account-link :account="record.account_id" />
    </div>
    <div
      v-if="record.balance !== undefined"
      class="w-3/12 flex items-center justify-start px-2 font-medium"
      style="min-width: 4em"
    >
      <near-symbol class="w-5 hidden sm:block" />&nbsp;{{
        $filters.number.compact(+$filters.toNear(record.balance))
      }}
    </div>
    <div
      v-if="record.balance !== undefined"
      class="w-2/12 px-2 font-medium"
      style="min-width: 4em"
    >
      {{ $filters.number.compact(record.score) }}
    </div>
    <div
      v-if="record.number_of_transactions !== undefined"
      class="w-2/12 px-2 font-medium"
      style="min-width: 4em"
    >
      {{ $filters.number.compact(record.number_of_transactions) }}
    </div>
  </div>
</template>

<script lang="ts">
import { CachedAccountRecord } from '@/services/near/indexer/types';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    record: {
      type: Object as PropType<CachedAccountRecord>,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
  },
});
</script>
