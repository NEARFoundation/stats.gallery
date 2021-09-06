import { Action } from '@/services/near/indexer/types';
import { toNear } from '@/utils/near';
import Highcharts from 'highcharts';
// import {
//   ComposeOption,
//   LineSeriesOption,
//   TooltipComponentOption,
// } from 'echarts';
import { DateTime } from 'luxon';
import { ref, Ref, watch } from 'vue';
import { AccountView } from '../../services/near/rpc/types';

// type Option = ComposeOption<LineSeriesOption | TooltipComponentOption>;

export function useBalanceHistoryChart({
  actions,
  views,
  initial,
  final,
}: {
  actions: Ref<Action[]>;
  views: Ref<(AccountView | undefined)[]>;
  initial?: {
    amount: string;
    timestamp: number;
  };
  final?: {
    amount: string;
    timestamp: number;
  };
}): Ref<Highcharts.Options> {
  const makeData = () => {
    const recorded: Highcharts.PointOptionsObject[] = actions.value.flatMap(
      (action, i) => {
        const view = views.value[i];
        if (action && view) {
          const time = DateTime.fromMillis(action.block_timestamp / 1_000_000);
          return [
            {
              // name: time.toLocaleString(DateTime.DATETIME_MED),
              // value: [time.toISO(), toNear(view.amount).toString()],
              x: time.toMillis(),
              y: +toNear(view.amount).toString(),
            },
          ];
        } else {
          return [];
        }
      },
    );

    if (initial) {
      const time = DateTime.fromMillis(initial.timestamp / 1_000_000);
      recorded.push({
        // name: time.toLocaleString(DateTime.DATETIME_MED),
        // value: [time.toISO(), toNear(initial.amount).toString()],
        x: time.toMillis(),
        y: +toNear(initial.amount).toString(),
      });
    }

    if (final) {
      const time = DateTime.fromMillis(final.timestamp / 1_000_000);
      recorded.unshift({
        // name: time.toLocaleString(DateTime.DATETIME_MED),
        // value: [time.toISO(), toNear(final.amount).toString()],
        x: time.toMillis(),
        y: +toNear(final.amount).toString(),
      });
    }

    return recorded;
  };

  const genOption: () => Highcharts.Options = () => {
    const g = makeData();
    return {
      //       chart: {
      //     type: 'area'
      // },
      // series: [{
      //     name: 'USA',
      //     data: g,
      //     // data: [
      //     //     null, null, null, null, null, 6, 11, 32, 110, 235,
      //     //     369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
      //     //     20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
      //     //     26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
      //     //     24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
      //     //     21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
      //     //     10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
      //     //     5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
      //     // ]
      // }]

      chart: {
        type: 'area',
      },
      title: {
        text: '',
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        series: {
          states: {
            inactive: {
              enabled: false,
            },
          },
        },
      },
      xAxis: {
        type: 'datetime',
        axisLabel: {
          // formatter(value: number) {
          //   return DateTime.fromMillis(value).toLocaleString(
          //     DateTime.DATE_SHORT,
          //   );
          // },
        },
      },
      yAxis: {
        type: 'linear',
        title: {
          text: 'Balance',
        },
      },
      series: [
        {
          name: 'Balance',
          type: 'area',
          step: 'right',
          color: 'rgb(124, 58, 237)',
          data: g,
        },
      ],
    };
  };

  const option = ref(genOption());

  watch([actions, views, initial, final], () => {
    option.value = genOption();
  });

  return option;
}
