import { deref, OptionalRef } from '@/utils/deref';
// import {
//   ComposeOption,
//   LineSeriesOption,
//   TooltipComponentOption,
// } from 'echarts';
import { DateTime } from 'luxon';
import { isRef, ref, Ref, watch } from 'vue';

// type Option = ComposeOption<LineSeriesOption | TooltipComponentOption>;

export function useNetworkActivityChart(
  data: OptionalRef<
    {
      new_accounts: number;
      block_date: string;
    }[]
  >,
): Ref<Highcharts.Options> {
  const makeData = () => {
    return deref(data).map(x => [
      DateTime.fromSQL(x.block_date).toMillis(),
      x.new_accounts,
    ]);
  };

  const genOption: () => Highcharts.Options = () => {
    const g = makeData();
    return {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      xAxis: {
        type: 'datetime',
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'linear',
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: 'Accounts',
          type: 'line',
          color: 'rgba(130, 130, 130, 0.2)',
          areaStyle: {
            color: 'rgba(130, 130, 130, 0.2)',
          },
          showSymbol: false,
          data: g,
        },
      ],
    };
  };

  const option = ref(genOption());

  watch(
    [data].filter(x => isRef(x)),
    () => {
      option.value = genOption();
    },
  );

  return option;
}
