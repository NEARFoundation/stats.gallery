import { Action } from '@/services/near/indexer/types';
import { toNear } from '@/utils/near';
import Highcharts from 'highcharts';
import { DateTime } from 'luxon';
import { ref, Ref, watch } from 'vue';
import { AccountView } from '../../services/near/rpc/types';

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
    const recorded: { x: number; y: number }[] = actions.value.flatMap(
      (action, i) => {
        const view = views.value[i];
        if (action && view) {
          const time = DateTime.fromMillis(action.block_timestamp / 1_000_000);
          return [
            {
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
        x: time.toMillis(),
        y: +toNear(initial.amount).toString(),
      });
    }

    if (final) {
      const time = DateTime.fromMillis(final.timestamp / 1_000_000);
      recorded.push({
        x: time.toMillis(),
        y: +toNear(final.amount).toString(),
      });
    }

    return recorded.sort((a, b) => a.x - b.x);
  };

  const genOption: () => Highcharts.Options = () => {
    const g = makeData();
    console.log('useBalanceHistoryChart', g);
    return {
      chart: {
        type: 'area',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        style: {
          fontFamily: 'DM Sans',
          fontWeight: '700',
          fontSize: '18px',
        },
      },
      tooltip: {
        headerFormat: '{point.key}<br />',
        style: {
          fontSize: '16px',
          fontWeight: '400',
        },
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
        labels: {
          style: {
            color: 'rgba(128, 128, 128, 1)',
            fontSize: '16px',
          },
        },
        lineColor: 'rgba(128, 128, 128, 0.3)',
        tickColor: 'rgba(128, 128, 128, 0.3)',
      },
      yAxis: {
        type: 'linear',
        title: {
          text: 'Balance',
          style: {
            color: 'black',
            textOutline: '2px white',
          },
        },
        labels: {
          style: {
            color: 'rgba(128, 128, 128, 1)',
            fontSize: '16px',
          },
        },
        gridLineColor: 'rgba(128, 128, 128, 0.1)',
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
