import { Timeframe } from '@/services/timeframe';
import { ref, watch } from 'vue';
import { useStat } from '../useStat';
import { BadgeComposable } from './BadgeComposable';

export function createBadgeComposable(
  path: string,
  level = 1,
): BadgeComposable {
  return args => {
    const achieved = ref(false);

    const { value, isLoading } = useStat(path, 0, {
      ...args,
      timeframe: Timeframe.ALL,
    });

    watch(value, value => {
      achieved.value = value >= level;
    });

    return {
      achieved,
      isLoading,
    };
  };
}
