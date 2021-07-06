import { Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { isTimeframe, Timeframe } from './timeframe';

export function useTimeframeFromUrl(): Ref<Timeframe> {
  const timeframe = ref(Timeframe.MONTH);
  const route = useRoute();

  watch(
    route,
    currentRoute => {
      const t = currentRoute.query['t'];
      if (t && isTimeframe(t)) {
        timeframe.value = t;
      }
    },
    {
      immediate: true,
    },
  );

  return timeframe;
}
