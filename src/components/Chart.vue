<template>
  <div v-if="autoresize" class="zw-container">
    <!-- zero-width container prevents chart from preventing container from shrinking -->
    <div
      ref="container"
      :style="`width: ${width}px`"
      class="dyn-container"
    ></div>
  </div>
  <div v-else ref="container"></div>
</template>

<style scoped>
.zw-container {
  width: 0;
  overflow-x: visible;
  height: 100%;
}

.dyn-container {
  height: 100%;
}
</style>

<style>
@media (prefers-color-scheme: dark) {
  .highcharts-axis-title {
    fill: theme('colors.gray.300') !important;
  }

  .highcharts-axis-labels > text {
    fill: theme('colors.gray.300') !important;
  }

  .highcharts-data-label > text {
    fill: theme('colors.gray.300') !important;
  }
}
</style>

<script lang="ts">
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { defineComponent, onMounted, PropType, ref, toRefs, watch } from 'vue';

export default defineComponent({
  props: {
    option: {
      type: Object as PropType<Highcharts.Options>,
      required: true,
    },
    autoresize: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { option } = toRefs(props);

    const container = ref<HTMLDivElement | null>(null);
    const chart = ref<Highcharts.Chart | null>(null);
    const width = ref(0);

    onMounted(() => {
      HighchartsMore(Highcharts);
      HighchartsSolidGauge(Highcharts);

      if (container.value !== null) {
        chart.value = Highcharts.chart(container.value, props.option);

        const obs = new ResizeObserver(entries => {
          for (let entry of entries) {
            let resizeWidth = 0;
            if (entry.contentBoxSize) {
              if (entry.contentBoxSize[0]) {
                resizeWidth = entry.contentBoxSize[0].inlineSize;
              } else {
                // legacy path
                resizeWidth = (
                  entry.contentBoxSize as unknown as Record<
                    'inlineSize',
                    number
                  >
                ).inlineSize;
              }
            } else {
              resizeWidth = entry.contentRect.width;
            }

            width.value = resizeWidth;

            requestAnimationFrame(() => {
              chart.value?.setSize(resizeWidth);
            });
          }
        });

        const p = container.value.parentElement?.parentElement;
        if (p) {
          obs.observe(p);
        }

        chart.value.update(props.option);
      }
    });

    watch([option, chart], ([option, chart]) => {
      if (chart !== null) {
        chart.update(option);
      }
    });

    return {
      container,
      width,
    };
  },
});
</script>
