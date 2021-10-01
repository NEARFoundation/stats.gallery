<template>
  <main class="flex-grow flex flex-col space-y-3">
    <DashboardCard title="Balance History">
      <BalanceHistoryLoader
        v-if="viewsIsLoading || actionsIsLoading"
        class="chart"
      />
      <Chart v-else class="chart" :option="balanceHistoryOption" autoresize />
    </DashboardCard>
    <DashboardCard title="Action Types">
      <PieChartLoader v-if="actionsIsLoading" class="chart" />
      <Chart v-else class="chart" :option="actionTypeOption" autoresize />
    </DashboardCard>
    <DashboardCard title="Top 10 Senders">
      <HorizontalBarChartLoader v-if="actionsIsLoading" class="chart" />
      <Chart v-else class="chart" :option="topIncomingOption" autoresize
    /></DashboardCard>
    <DashboardCard title="Top 10 Receivers">
      <HorizontalBarChartLoader v-if="actionsIsLoading" class="chart" />
      <Chart v-else class="chart" :option="topOutgoingOption" autoresize
    /></DashboardCard>
  </main>
</template>

<style scoped>
.chart {
  height: 450px;
}
</style>

<script lang="ts">
import Chart from '@/components/Chart.vue';
import BalanceHistoryLoader from '@/components/charts/loaders/BalanceHistoryLoader.vue';
import HorizontalBarChartLoader from '@/components/charts/loaders/HorizontalBarChartLoader.vue';
import PieChartLoader from '@/components/charts/loaders/PieChartLoader.vue';
import { useActionTypeChart } from '@/composables/charts/useActionTypeChart';
import { useBalanceHistoryChart } from '@/composables/charts/useBalanceHistoryChart';
import { useTopIncomingChart } from '@/composables/charts/useTopIncomingChart';
import { useTopOutgoingChart } from '@/composables/charts/useTopOutgoingChart';
import { useAccountViews } from '@/composables/useAccountViews';
import { useNear } from '@/composables/useNear';
import { useReceiptActions } from '@/composables/useReceiptActions';
import { ActionKind } from '@/services/near/indexer/types';
import { Timeframe, timeframeToPastTimestamp } from '@/services/timeframe';
import { defineComponent, onMounted, reactive, watch } from '@vue/runtime-core';
import DashboardCard from './overview/DashboardCard.vue';

export default defineComponent({
  components: {
    Chart,
    BalanceHistoryLoader,
    PieChartLoader,
    HorizontalBarChartLoader,
    DashboardCard,
  },
  setup() {
    const { account, network, timeframe, rpc } = useNear();
    const { actions, isLoading: actionsIsLoading } = useReceiptActions({
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
    onMounted(() => {
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
    });
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
