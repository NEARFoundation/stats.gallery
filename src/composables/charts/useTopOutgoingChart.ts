import { Action } from '@/services/near/indexer/types';
import { ref, Ref, watch } from 'vue';

export function useTopOutgoingChart(
  actions: Ref<Action[]>,
): Ref<Highcharts.Options> {
  const makeData = () => {
    const groups = actions.value.reduce((acc, current) => {
      const account = current.receiver_account_id;
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

    const slice = ordered.slice(0, 10);

    return {
      category: slice.map(x => x.name),
      data: slice.map(x => x.value),
    };
  };

  const genOption: () => Highcharts.Options = () => {
    const g = makeData();
    return {
      chart: {
        type: 'bar',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        style: {
          fontFamily: 'DM Sans',
          fontWeight: '700',
          fontSize: '18px',
        },
      },
      credits: {
        enabled: false,
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
      xAxis: {
        boundaryGap: [0, 0.01],
        categories: g.category,
        labels: {
          overflow: 'allow',
          style: {
            width: 200,
            textOverflow: 'ellipsis',
            fontSize: '16px',
            color: 'black',
            textOutline: '',
          },
        },
        lineColor: 'rgba(128, 128, 128, 0.2)',
      },
      yAxis: {
        title: {
          text: '',
        },
        labels: {
          style: {
            fontSize: '12px',
            fontWeight: '400',
          },
        },
        gridLineColor: 'rgba(128, 128, 128, 0.1)',
      },
      plotOptions: {
        bar: {
          borderWidth: 0,
          borderRadius: 5,
          color: '#ef4444',
        },
      },
      series: [
        {
          name: 'Transactions',
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
