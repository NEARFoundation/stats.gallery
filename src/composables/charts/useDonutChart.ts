import { deref, OptionalRef } from '@/utils/deref';
import { isRef, ref, Ref, watch } from 'vue';

export interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

export function useDonutChart(
  items: OptionalRef<DonutSlice[]>,
): Ref<Highcharts.Options> {
  const genOption: () => Highcharts.Options = () => ({
    chart: {
      type: 'pie',
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
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: 'Transactions',
        type: 'pie',
        size: '70%',
        innerSize: '45%',
        borderWidth: 0.5,
        borderColor: 'white',
        data: deref(items).map(item => ({
          name: item.name,
          color: item.color,
          y: item.value,
        })),
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
