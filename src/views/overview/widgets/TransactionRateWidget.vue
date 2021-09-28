<template>
  <DashboardCard
    class="col-span-2 xl:col-span-1 order-7 md:order-none"
    title="Weekly Transaction Rate"
    embed="embed:transaction-rate"
  >
    <template #help>
      This is the number of transactions you've sent over the past 7 days. Are
      you cookin', cruisin', or crawlin'?
    </template>
    <template #default>
      <div class="flex flex-1" style="min-height: 250px">
        <Chart
          class="chart flex-shrink"
          :option="weeklyTransactionRateOption"
          autoresize
        />
      </div>
    </template>
  </DashboardCard>
</template>

<script lang="ts">
import { useGaugeChart } from '@/composables/charts/useGaugeChart';
import { useNear } from '@/composables/useNear';
import { useRecentActions } from '@/composables/useRecentActions';
import { Timeframe } from '@/services/timeframe';
import { defineComponent, ref, watch } from 'vue';
import Chart from '@/components/Chart.vue';
import DashboardCard from '../DashboardCard.vue';

export default defineComponent({
  components: {
    DashboardCard,
    Chart,
  },
  setup() {
    const { account, network } = useNear();
    const { actions, isLoading } = useRecentActions({
      account,
      network,
      timeframe: Timeframe.WEEK,
    });
    const actionsLength = ref(0);
    watch(actions, actions => {
      actionsLength.value = actions.length;
    });

    const weeklyTransactionRateOption = useGaugeChart(actionsLength);

    return {
      weeklyTransactionRateOption,
      isLoading,
    };
  },
});
</script>
