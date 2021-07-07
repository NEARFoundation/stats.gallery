<template>
  <h1 class="text-2xl font-medium text-center">Action Types</h1>
  <VChart class="chart" theme="light" :option="actionTypeOption" />
  <h1 class="text-2xl font-medium text-center">Top 10 Senders</h1>
  <VChart class="chart" theme="light" :option="topIncomingOption" />
  <h1 class="text-2xl font-medium text-center">Top 10 Receivers</h1>
  <VChart class="chart" theme="light" :option="topOutgoingOption" />
  <button @click="run">Click</button>
</template>

<style scoped>
.chart {
  height: 450px;
  width: 100%;
}
</style>

<script lang="ts">
import { useActionTypeChart } from '@/services/charts/useActionTypeChart';
import { useTopIncomingChart } from '@/services/charts/useTopIncomingChart';
import { useTopOutgoingChart } from '@/services/charts/useTopOutgoingChart';
import { useRecentActions } from '@/services/near/indexer/useRecentActions';
import { useNear } from '@/services/useNear';
import { toNear } from '@/utils/near';
import { defineComponent } from '@vue/runtime-core';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { DateTime } from 'luxon';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, BarChart, TooltipComponent, GridComponent]);

export default defineComponent({
  components: {
    VChart,
  },
  setup() {
    const { account, network, timeframe, rpc } = useNear();
    const { actions } = useRecentActions({ account, network, timeframe });
    const actionTypeOption = useActionTypeChart(actions);
    const topIncomingOption = useTopIncomingChart(actions);
    const topOutgoingOption = useTopOutgoingChart(actions);

    const run = async () => {
      const balances = await Promise.all(
        actions.value.flatMap(action => [
          rpc.viewAccount({
            account: account.value,
            blockId: action.receipt_included_in_block_height + 1, // Wait for gas to be settled
          }),
        ]),
      );
      balances.forEach((view, i) => {
        if ('result' in view) {
          console.log(
            i,
            DateTime.fromMillis(
              actions.value[Math.floor(i)].block_timestamp / 1_000_000,
            ).toRFC2822(),
            toNear(view.result.amount).toString(),
            view.result,
          );
        } else {
          console.log('error', i, view);
        }
      });
    };

    return {
      actionTypeOption,
      topIncomingOption,
      topOutgoingOption,
      run,
    };
  },
});
</script>
