import { deref, OptionalRef } from '@/utils/deref';
// import {
//   ComposeOption,
//   PieSeriesOption,
//   TooltipComponentOption,
// } from 'echarts';
import { isRef, ref, Ref, watch } from 'vue';

// type Option = ComposeOption<PieSeriesOption | TooltipComponentOption>;

export interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

export function useDonutChart(
  items: OptionalRef<DonutSlice[]>,
): Ref<Highcharts.Options> {
  const genOption: () => Highcharts.Options = () => ({
    tooltip: {
      // trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: ['70%', '45%'],
        itemStyle: {
          borderRadius: 12,
          borderColor: '#fff',
          borderWidth: 2,
          color: function (item: any) {
            return item.data.color ?? item.color;
          } as any,
        },
        label: {
          show: false,
        },
        data: deref(items),
        emphasis: {
          scale: false,
        },
      },
    ],
  });

  const option = ref(genOption());

  if (isRef(items)) {
    watch(items, () => {
      option.value = genOption();
    });
  }

  return option;
}
