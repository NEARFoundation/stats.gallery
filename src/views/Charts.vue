<template>
  <button @click="add">Click</button>
  <v-chart class="chart" :option="option" />
</template>

<style scoped>
.chart {
  height: 450px;
  width: 450px;
}
</style>

<script lang="ts">
import { PieChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { defineComponent, ref } from 'vue';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TooltipComponent]);

export default defineComponent({
  components: {
    VChart,
  },
  setup() {
    const data = [
      {
        value: 1048,
        name: 'Function Call',
        itemStyle: { color: 'rgb(251, 191, 36)' },
      },
      {
        value: 735,
        name: 'Transfer',
        itemStyle: { color: 'rgb(31, 41, 55)' },
      },
      {
        value: 580,
        name: 'Add Key',
        itemStyle: { color: 'rgb(16, 185, 129)' },
      },
      {
        value: 484,
        name: 'Delete Key',
        itemStyle: { color: 'rgb(220, 38, 38)' },
      },
      {
        value: 300,
        name: 'Deploy Contract',
        itemStyle: { color: 'rgb(29, 78, 216)' },
      },
    ];

    const genOption = () => ({
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'Actions',
          type: 'pie',
          radius: '50%',
          data,
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

    let x = 0;

    const r = () => Math.floor(Math.random() * 256);

    return {
      option,
      add() {
        data.push({
          value: 100,
          name: 'Test ' + x++,
          itemStyle: { color: `rgb(${r()}, ${r()}, ${r()})` },
        });

        option.value = genOption();
      },
    };
  },
});
</script>
