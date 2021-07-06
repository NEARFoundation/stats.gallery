<template>
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
import { useTopIncomingChart } from '@/services/charts/useTopIncomingChart';
import { useTopOutgoingChart } from '@/services/charts/useTopOutgoingChart';
import { useRecentActions } from '@/services/near/useRecentActions';
import { useNear } from '@/services/useNear';
import { defineComponent } from '@vue/runtime-core';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, BarChart, TooltipComponent, GridComponent]);

export default defineComponent({
  components: {
    VChart,
  },
  setup() {
    const { account, network, timeframe } = useNear();
    const { actions } = useRecentActions({ account, network, timeframe });
    const actionTypeOption = useActionTypeChart(actions);
    const topIncomingOption = useTopIncomingChart(actions);
    const topOutgoingOption = useTopOutgoingChart(actions);

    return {
      actionTypeOption,
      topIncomingOption,
      topOutgoingOption,
    };
  },
});
</script>
