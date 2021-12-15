import { Timeframe } from '@/utils/timeframe';
import { ref, watch } from 'vue';
import { useSingle } from '../useSingle';
import { BadgeComposable } from './BadgeComposable';

export function createBadgeComposable(
  path: string,
  level = 1,
): BadgeComposable {
  return args => {
    const achieved = ref(false);

    const { value, isLoading } = useSingle(
      path,
      {
        ...args,
        timeframe: Timeframe.ALL,
      },
      0,
    );

    watch(value, value => {
      achieved.value = value >= level;
    });

    return {
      achieved,
      isLoading,
    };
  };
}
