<template>
  <h1 class="text-2xl font-medium text-center">Balance History</h1>
  <BalanceHistoryLoader
    v-if="viewsIsLoading || actionsIsLoading"
    class="chart"
  />
  <VChart v-else class="chart" theme="light" :option="balanceHistoryOption" />
  <h1 class="text-2xl font-medium text-center">Action Types</h1>
  <PieChartLoader v-if="actionsIsLoading" class="chart" />
  <VChart v-else class="chart" theme="light" :option="actionTypeOption" />
  <h1 class="text-2xl font-medium text-center">Top 10 Senders</h1>
  <HorizontalBarChartLoader v-if="actionsIsLoading" class="chart" />
  <VChart v-else class="chart" theme="light" :option="topIncomingOption" />
  <h1 class="text-2xl font-medium text-center">Top 10 Receivers</h1>
  <HorizontalBarChartLoader v-if="actionsIsLoading" class="chart" />
  <VChart v-else class="chart" theme="light" :option="topOutgoingOption" />
</template>

<style scoped>
.chart {
  height: 450px;
  width: 100%;
}
</style>

<script lang="ts">
import BalanceHistoryLoader from '@/components/charts/loaders/BalanceHistoryLoader.vue';
import HorizontalBarChartLoader from '@/components/charts/loaders/HorizontalBarChartLoader.vue';
import PieChartLoader from '@/components/charts/loaders/PieChartLoader.vue';
import { useActionTypeChart } from '@/composables/charts/useActionTypeChart';
import { useBalanceHistoryChart } from '@/composables/charts/useBalanceHistoryChart';
import { useTopIncomingChart } from '@/composables/charts/useTopIncomingChart';
import { useTopOutgoingChart } from '@/composables/charts/useTopOutgoingChart';
import { useAccountViews } from '@/composables/useAccountViews';
import { useActions } from '@/composables/useActions';
import { useNear } from '@/composables/useNear';
import { ActionKind } from '@/services/near/indexer/types';
import { Timeframe, timeframeToPastTimestamp } from '@/services/timeframe';
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
    BalanceHistoryLoader,
    PieChartLoader,
    HorizontalBarChartLoader,
  },
  setup() {
    const { account, network, timeframe, rpc } = useNear();
    const { actions, isLoading: actionsIsLoading } = useActions({
      account,
      network,
      timeframe,
    });
    const { views, isLoading: viewsIsLoading } = useAccountViews({
      account,
      actions,
      network,
    });
    const actionTypeOption = useActionTypeChart(actions);
    const topIncomingOption = useTopIncomingChart(actions);
    const topOutgoingOption = useTopOutgoingChart(actions);
    const finalBalance = reactive({
      timestamp: Date.now() * 1_000_000,
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
    const initialBalance = reactive({
      timestamp: 0,
      amount: '0',
    });
    watch(
      [views, actions, timeframe, finalBalance],
      ([views, actions, timeframe]) => {
        // Do we have a CREATE_ACCOUNT action in scope?
        const createAccountAction = actions.find(
          action =>
            action.action_kind === ActionKind.CREATE_ACCOUNT &&
            action.receiver_account_id === account.value,
        );
        const selectedEnd = timeframeToPastTimestamp(timeframe) * 1_000_000;

        if (
          createAccountAction &&
          createAccountAction.block_timestamp > selectedEnd
        ) {
          // Truncate view to time when account exists
          initialBalance.timestamp = createAccountAction.block_timestamp;
          initialBalance.amount = '0';
        } else {
          // No CREATE_ACCOUNT action
          if (timeframe === Timeframe.ALL) {
            // This should not happen often: No CREATE_ACCOUNT action despite displaying Timeframe.ALL
            if (actions.length) {
              initialBalance.timestamp =
                actions[actions.length - 1].block_timestamp;
              initialBalance.amount = views[views.length - 1]?.amount ?? '0';
            }
          } else {
            // Only display selected portion
            initialBalance.timestamp = selectedEnd;
            const last = views[views.length - 1];
            initialBalance.amount = last?.amount ?? finalBalance.amount;
          }
        }
      },
    );
    const balanceHistoryOption = useBalanceHistoryChart({
      actions,
      views,
      final: finalBalance,
      initial: initialBalance,
    });

    return {
      actionTypeOption,
      topIncomingOption,
      topOutgoingOption,
      balanceHistoryOption,
      actionsIsLoading,
      viewsIsLoading,
    };
  },
});
</script>
