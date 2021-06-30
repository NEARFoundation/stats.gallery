<template>
  <v-chart class="chart" theme="light" :option="option" />
</template>

<style scoped>
.chart {
  height: 450px;
  width: 450px;
}
</style>

<script lang="ts">
import { ActionKind } from '@/services/near/types';
import { useRecentActions } from '@/services/near/useRecentActions';
import { nearContext } from '@/utils/near';
import { PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defineComponent, ref, watch } from 'vue';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TooltipComponent]);

export default defineComponent({
  components: {
    VChart,
  },
  setup() {
    const { account } = nearContext();
    const { actions } = useRecentActions({ account });

    const pieSlice = (name: string, value: number, color: string) => ({
      name,
      value,
      itemStyle: { color },
    });

    const makeData = () => {
      const groups = actions.value.reduce((acc, current) => {
        const ak = current.action_kind;
        if (!acc[ak]) {
          acc[ak] = 0;
        }
        acc[ak]++;
        return acc;
      }, {} as Record<ActionKind, number>);

      return [
        pieSlice(
          'Function Call',
          groups[ActionKind.FUNCTION_CALL],
          'rgb(251, 191, 36)',
        ),
        pieSlice('Transfer', groups[ActionKind.TRANSFER], 'rgb(31, 41, 55)'),
        pieSlice('Add Key', groups[ActionKind.ADD_KEY], 'rgb(16, 185, 129)'),
        pieSlice(
          'Delete Key',
          groups[ActionKind.DELETE_KEY],
          'rgb(220, 38, 38)',
        ),
        pieSlice(
          'Create Account',
          groups[ActionKind.CREATE_ACCOUNT],
          'rgb(16, 185, 129)',
        ),
        pieSlice(
          'Delete Account',
          groups[ActionKind.DELETE_ACCOUNT],
          'rgb(220, 38, 38)',
        ),
        pieSlice(
          'Deploy Contract',
          groups[ActionKind.DEPLOY_CONTRACT],
          'rgb(29, 78, 216)',
        ),
        pieSlice('Stake', groups[ActionKind.STAKE], 'rgb(109, 40, 217)'),
      ];
    };

    const genOption = () => ({
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'Actions',
          type: 'pie',
          radius: '50%',
          data: makeData(),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    });

    const option = ref(genOption());

    watch([account, actions], () => {
      option.value = genOption();
    });

    return {
      option,
    };
  },
});
</script>
