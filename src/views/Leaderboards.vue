<template>
  <main class="flex-grow flex flex-col space-y-3">
    <LeaderboardTableCard title="Rich List" :records="balanceLeaderboard" />
    <LeaderboardTableCard title="Top Score" :records="scoreLeaderboard" />
  </main>
</template>

<style scoped>
.chart {
  height: 450px;
}
</style>

<script lang="ts">
import { useMultiple } from '@/composables/useMultiple';
import { Network } from '@/services/near/indexer/networks';
import { CachedAccountRecord } from '@/services/near/indexer/types';
import { Timeframe } from '@/utils/timeframe';
import { defineComponent } from '@vue/runtime-core';
import LeaderboardTableCard from './leaderboards/LeaderboardTableCard.vue';

export default defineComponent({
  components: {
    LeaderboardTableCard,
  },
  setup() {
    const { value: balanceLeaderboard } = useMultiple<CachedAccountRecord>(
      'leaderboard-balance',
      {
        account: '',
        network: Network.MAINNET,
        timeframe: Timeframe.ALL,
      },
      [],
    );

    const { value: scoreLeaderboard } = useMultiple<CachedAccountRecord>(
      'leaderboard-score',
      {
        account: '',
        network: Network.MAINNET,
        timeframe: Timeframe.ALL,
      },
      [],
    );

    return {
      balanceLeaderboard,
      scoreLeaderboard,
    };
  },
});
</script>
