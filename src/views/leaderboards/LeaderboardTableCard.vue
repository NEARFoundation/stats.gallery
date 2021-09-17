<template>
  <DashboardCard :title="title">
    <div class="p-3 flex flex-col">
      <div
        class="
          flex
          relative
          font-bold
          bg-gray-100
          dark:bg-gray-700
          py-2
          mb-3
          rounded
          truncate
        "
      >
        <div class="px-2 w-1/12 hidden sm:block">Rank</div>
        <div class="px-2 flex-1">Account</div>
        <div class="px-2 w-3/12" style="min-width: 4em">Balance</div>
        <div class="px-2 w-2/12" style="min-width: 4em">Score</div>
      </div>
      <div class="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
        <LeaderboardRow
          v-for="(record, i) of records.slice(0, limit)"
          :key="record.account_id"
          :record="record"
          :rank="i + 1"
        />
      </div>
    </div>
  </DashboardCard>
</template>

<script lang="ts">
import { CachedAccountRecord } from '@/services/near/indexer/types';
import { defineComponent, PropType } from 'vue';
import DashboardCard from '../overview/DashboardCard.vue';
import LeaderboardRow from './LeaderboardRow.vue';

export default defineComponent({
  components: { DashboardCard, LeaderboardRow },
  props: {
    title: {
      type: String,
      required: true,
    },
    records: {
      type: Object as PropType<CachedAccountRecord[]>,
      required: true,
    },
    limit: {
      type: Number,
      default: 10,
    },
  },
});
</script>
