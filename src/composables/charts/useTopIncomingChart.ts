import { Action } from '@/services/near/indexer/types';
import { clipString } from '@/utils/clipString';
// import {
//   BarSeriesOption,
//   ComposeOption,
//   TooltipComponentOption,
// } from 'echarts';
import { ref, Ref, watch } from 'vue';

// type Option = ComposeOption<BarSeriesOption | TooltipComponentOption>;

export function useTopIncomingChart(
  actions: Ref<Action[]>,
): Ref<Highcharts.Options> {
  const makeData = () => {
    const groups = actions.value.reduce((acc, current) => {
      const account = current.predecessor_account_id;
      if (!acc[account]) {
        acc[account] = 0;
      }
      acc[account]++;
      return acc;
    }, {} as Record<string, number>);

    const ordered = Object.keys(groups).map(key => ({
      name: key,
      value: groups[key],
    }));

    ordered.sort((a, b) => b.value - a.value);

    const slice = ordered.slice(0, 10).reverse();

    return {
      category: slice.map(x => x.name),
      data: slice.map(x => x.value),
    };
  };

  const genOption: () => Highcharts.Options = () => {
    const g = makeData();
    return {
      grid: {
        left: '13%',
        containLabel: true,
      },
      tooltip: {
        // trigger: 'item',
      },
      xAxis: {
        type: 'linear',
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: 'category',
        data: g.category,
        axisLabel: {
          formatter: (name: string) => {
            return clipString(name, 22, 2);
          },
        },
      },
      series: [
        {
          name: 'Accounts',
          type: 'bar',
          data: g.data,
        },
      ],
    };
  };

  const option = ref(genOption());

  watch(actions, () => {
    option.value = genOption();
  });

  return option;
}
