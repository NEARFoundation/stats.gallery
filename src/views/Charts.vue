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
import { ActionKind } from '@/services/near/indexer/types';
import { Timeframe, timeframeToPastTimestamp } from '@/services/timeframe';
import { useAccountViews } from '@/services/useAccountViews';
import { useActions } from '@/services/useActions';
import { useNear } from '@/services/useNear';
import { defineComponent, reactive, watch } from '@vue/runtime-core';
import { init } from 'echarts';
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
    const { actions } = useActions({ account, network, timeframe });
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
    const initialBalance = reactive({
      timestamp: 0,
      amount: '0',
    });
    watch(
      [views, actions, timeframe, finalBalance],
      ([views, actions, timeframe]) => {
        if (actions.length) {
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
            // Only display selected portion
            initialBalance.timestamp = selectedEnd;
            const last = views[views.length - 1];
            if (last) {
              initialBalance.amount = last.amount;
            } else {
              initialBalance.amount = finalBalance.amount;
            }
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
    };
  },
});
</script>
