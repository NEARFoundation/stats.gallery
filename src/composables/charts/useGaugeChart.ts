// import { ComposeOption, GaugeSeriesOption } from 'echarts';
import { isRef, ref, Ref, watch } from 'vue';

// type Option = ComposeOption<GaugeSeriesOption>;

export function useGaugeChart(
  value: Ref<number>,
  options?: { min?: Ref<number>; max?: Ref<number> },
): Ref<Highcharts.Options> {
  const genOption: () => Highcharts.Options = () => {
    return {
      series: [
        {
          type: 'gauge',
          center: ['50%', '65%'],
          startAngle: 200,
          endAngle: -20,
          min: options?.min?.value ?? 0,
          max: options?.max?.value ?? 60,
          splitNumber: 12,
          itemStyle: {
            color: 'rgb(196, 181, 253)',
          },
          progress: {
            show: true,
            width: 10,
          },
          pointer: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: 10,
              color: [[1, 'rgba(127, 127, 127, 0.5)']],
            },
          },
          axisTick: {
            distance: -25,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: 'rgba(127, 127, 127, 0.5)',
            },
          },
          splitLine: {
            distance: -32,
            length: 14,
            lineStyle: {
              width: 3,
              color: 'rgba(127, 127, 127, 0.5)',
            },
          },
          axisLabel: {
            show: false,
            distance: -30,
            color: 'rgba(187, 187, 187, 0.75)',
            fontSize: 14,
          },
          anchor: {
            show: false,
          },
          title: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '-15%'],
            fontSize: 30,
            fontWeight: 'bolder',
            color: '#9333EA',
          },
          data: [
            {
              value: value.value,
            },
          ],
        },
        {
          type: 'gauge',
          center: ['50%', '65%'],
          startAngle: 200,
          endAngle: -20,
          min: options?.min?.value ?? 0,
          max: options?.max?.value ?? 60,
          splitNumber: 12,
          itemStyle: {
            color: '#9333EA',
          },
          progress: {
            show: true,
            width: 3,
          },
          pointer: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          anchor: {
            show: false,
          },
          title: {
            show: false,
          },
          detail: {
            show: false,
          },
          data: [
            {
              value: value.value,
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
