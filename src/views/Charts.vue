<template>
  <VChart class="chart" theme="light" :option="actionTypeOption" />
</template>

<style scoped>
.chart {
  height: 450px;
  width: 450px;
}
</style>

<script lang="ts">
import { useActionTypeChart } from '@/services/charts/useActionTypeChart';
import { useRecentActions } from '@/services/near/useRecentActions';
import { useNear } from '@/services/useNear';
import { defineComponent } from '@vue/runtime-core';
import { BarChart, PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, BarChart, TooltipComponent]);

export default defineComponent({
  components: {
    VChart,
  },
  setup() {
    const { account, network, timeframe } = useNear();
    const { actions } = useRecentActions({ account, network, timeframe });
    const actionTypeOption = useActionTypeChart(actions);

    return {
      actionTypeOption,
    };
  },
});
</script>
