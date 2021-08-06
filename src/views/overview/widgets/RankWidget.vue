<template>
  <DashboardCard title="Activity Rank">
    <template #help>How do you stack up against other accounts?</template>
    <template #default>
      <div
        class="
          flex
          items-center
          flex-grow
          p-3
          flex-row flex-wrap
          justify-center
        "
      >
        <div class="flex-grow">
          <div class="text-2xl font-bold text-center">
            #{{ $filters.number.standard(ranking) }}
          </div>
        </div>
        <div class="relative p-2">
          <DonutChart
            :fraction="(percentile - 0.69) / 0.31"
            :trackThickness="10"
            :thickness="10"
            lineCap="round"
            color="rgb(124, 58, 237)"
            trackColor="rgb(226, 232, 240)"
            class="w-24 h-24"
          />
          <div
            class="
              absolute
              top-0
              left-0
              w-full
              h-full
              flex
              items-center
              justify-center
            "
          >
            <div class="font-bold text-lg">
              {{ $filters.number.percent(percentile) }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardCard>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { usePromise } from '@/composables/usePromise';
import { useStat } from '@/composables/useStat';
import { Await } from '@/utils/types';
import { defineComponent, ref, watch } from 'vue';
import DashboardCard from '../DashboardCard.vue';
import DonutChart from '../DonutChart.vue';

export default defineComponent({
  components: { DashboardCard, DonutChart },
  setup() {
    const { account, network, timeframe, indexer } = useNear();
    const { value: distribution, isLoading } = usePromise(
      network,
      () => indexer.getDistribution(),
      {
        total: 0,
      } as Await<ReturnType<typeof indexer.getDistribution>>,
    );
    const { value: transactionCount } = useStat('transaction-count', 0, {
      account,
      network,
      timeframe,
    });
    const percentile = ref(0.7);
    const ranking = ref(0);

    watch(
      [distribution, transactionCount],
      ([distribution, transactionCount]) => {
        const unsorted = Object.keys(distribution).filter(k => k !== 'total');
        const sorted = unsorted.sort((a, b) => parseFloat(b) - parseFloat(a));
        const p = sorted.find(x => transactionCount >= distribution[x]);
        if (p) {
          const float = parseFloat(p);
          percentile.value = float;
          ranking.value = ((1 - float) * distribution.total) | 0;
        }
      },
    );

    return {
      percentile,
      ranking,
    };
  },
});
</script>
