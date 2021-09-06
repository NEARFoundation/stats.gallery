import { deref, OptionalRef } from '@/utils/deref';
import { DateTime } from 'luxon';
import { isRef, ref, Ref, watch } from 'vue';

export function useNetworkActivityChart(
  data: OptionalRef<
    {
      new_accounts: number;
      block_date: string;
    }[]
  >,
): Ref<Highcharts.Options> {
  const makeData: () => Highcharts.PointOptionsObject[] = () => {
    return deref(data).map(point => ({
      x: DateTime.fromSQL(point.block_date).toMillis(),
      y: point.new_accounts,
    }));
  };

  const genOption: () => Highcharts.Options = () => {
    const g = makeData();
    return {
      chart: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        margin: 0,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: '',
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime',
        labels: {
          enabled: false,
        },
        tickWidth: 0,
        lineWidth: 0,
        maxPadding: 0,
        minPadding: 0,
      },
      yAxis: {
        type: 'linear',
        labels: {
          enabled: false,
        },
        title: {
          text: '',
        },
        gridLineWidth: 0,
      },
      series: [
        {
          name: 'Accounts',
          type: 'area',
          color: 'rgba(130, 130, 130, 0.2)',
          fillColor: 'rgba(130, 130, 130, 0.2)',
          marker: {
            enabled: false,
          },
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
