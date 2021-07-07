<template>
  <h1 class="text-2xl font-medium text-center">Balance History</h1>
  <VChart class="chart" theme="light" :option="balanceHistoryOption" />
  <h1 class="text-2xl font-medium text-center">Action Types</h1>
  <VChart class="chart" theme="light" :option="actionTypeOption" />
  <h1 class="text-2xl font-medium text-center">Top 10 Senders</h1>
  <VChart class="chart" theme="light" :option="topIncomingOption" />
  <h1 class="text-2xl font-medium text-center">Top 10 Receivers</h1>
  <VChart class="chart" theme="light" :option="topOutgoingOption" />
</template>

<style scoped>
.chart {
  height: 450px;
  width: 100%;
}
</style>

<script lang="ts">
import { useActionTypeChart } from '@/services/charts/useActionTypeChart';
import { useBalanceHistoryChart } from '@/services/charts/useBalanceHistoryChart';
import { useTopIncomingChart } from '@/services/charts/useTopIncomingChart';
import { useTopOutgoingChart } from '@/services/charts/useTopOutgoingChart';
import { useAccountViews } from '@/services/useAccountViews';
import { useNear } from '@/services/useNear';
import { useRecentActions } from '@/services/useRecentActions';
import { defineComponent, reactive, watch } from '@vue/runtime-core';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TooltipComponent,
  GridComponent,
]);

export default defineComponent({
  components: {
    VChart,
  },
  setup() {
    const { account, network, timeframe, rpc } = useNear();
    const { actions } = useRecentActions({ account, network, timeframe });
    const { views } = useAccountViews({ account, actions, network });
    const actionTypeOption = useActionTypeChart(actions);
    const topIncomingOption = useTopIncomingChart(actions);
    const topOutgoingOption = useTopOutgoingChart(actions);
    const finalBalance = reactive({
      timestamp: 0,
      amount: '0',
    });
    watch(
      [account, network],
      async () => {
        const res = await rpc.viewAccount({
          account: account.value,
          finality: 'final',
        });

        if ('result' in res) {
          finalBalance.amount = res.result.amount;
        } else {
          finalBalance.amount = '0';
        }
        finalBalance.timestamp = Date.now() * 1_000_000;
      },
      { immediate: true },
    );
    const balanceHistoryOption = useBalanceHistoryChart({
      actions,
      views,
      final: finalBalance,
    });

    return {
      actionTypeOption,
      topIncomingOption,
      topOutgoingOption,
      balanceHistoryOption,
    };
  },
});
</script>
