import { Timeframe } from '@/utils/timeframe';
import { ref, watch } from 'vue';
import { useMultiple } from '../useMultiple';
import { BadgeComposable } from './BadgeComposable';

export function createBadgeComposable(
  path: string,
  level = 1,
): BadgeComposable {
  return args => {
    const badgeResults = ref([]);

    const { value: badges, isLoading } = useMultiple(
      path,
      {
        ...args,
        timeframe: Timeframe.ALL,
      },
      [],
    );

    watch(badges, value => {
      badgeResults.value = value;
    });

    return {
      badges: badgeResults,
      isLoading,
    };
  };
}
