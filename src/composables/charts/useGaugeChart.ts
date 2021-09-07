import { isRef, ref, Ref, watch } from 'vue';

export function useGaugeChart(
  value: Ref<number>,
  options?: { min?: Ref<number>; max?: Ref<number> },
): Ref<Highcharts.Options> {
  const genOption: () => Highcharts.Options = () => {
    return {
      chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'DM Sans',
          fontWeight: '700',
          fontSize: '18px',
        },
      },
      tooltip: {
        enabled: false,
      },
      title: {
        text: '',
      },
      pane: {
        startAngle: 240,
        endAngle: 480,
        center: ['50%', '60%'],
        size: '80%',
        background: [
          {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
        ],
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            borderWidth: 0,
            y: -50,
            style: {
              fontSize: '300%',
              textOutline: '2px white',
            },
          },
        },
      },
      yAxis: {
        min: 0,
        max: 60,
        lineWidth: 0,
        labels: {
          distance: '125%',
          style: {
            fontSize: '16px',
            color: 'rgb(128, 128, 128)',
          },
        },
        tickLength: 8,
        tickPosition: 'outside',
        tickWidth: 2,
        tickColor: 'rgba(140, 140, 140, 0.7)',
        minorTickLength: 4,
        minorTickPosition: 'outside',
        minorTickWidth: 2,
        minorTickColor: 'rgba(140, 140, 140, 0.3)',
        plotBands: [
          {
            from: 0,
            to: 60,
            innerRadius: '80%',
            outerRadius: '95%',
            color: 'rgba(140, 140, 140, 0.2)',
          },
          {
            from: 0,
            to: 60,
            innerRadius: '95%',
            outerRadius: '96%',
            color: 'rgba(140, 140, 140, 0.3)',
          },
        ],
      },
      series: [
        {
          type: 'solidgauge',
          name: 'Transactions',
          data: [
            {
              color: '#ff9ed0',
              y: value.value,
              innerRadius: '80%',
              radius: '95%',
            },
            {
              color: 'rgb(239,93,168)',
              y: value.value,
              innerRadius: '91%',
              radius: '95%',
            },
          ],
        },
      ],
    };
  };

  const option = ref(genOption());

  watch(
    [value, options?.max, options?.min].filter(x => isRef(x)),
    () => {
      option.value = genOption();
    },
  );

  return option;
}
