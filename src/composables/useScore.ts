import { Network } from '@/services/near/indexer/networks';
import { Timeframe } from '@/services/timeframe';
import { OptionalRef } from '@/utils/deref';
import { AccountLevel, currentLevel } from '@/utils/level';
import { ref, Ref, watch } from 'vue';
import { useSingle } from './useSingle';

export function useScore({
  account,
  network,
  timeframe,
}: {
  account: OptionalRef<string>;
  network: OptionalRef<Network>;
  timeframe: OptionalRef<Timeframe>;
}): {
  score: Ref<number>;
  accountLevel: Ref<AccountLevel>;
  isLoading: Ref<boolean>;
} {
  const { value: score, isLoading } = useSingle(
    'score-calculate',
    {
      account,
      network,
      timeframe,
    },
    0,
  );
  const accountLevel = ref({
    level: 0,
    requiredToNextLevel: 0,
    creditToNextLevel: 0,
  } as AccountLevel);

  watch(
    score,
    score => {
      accountLevel.value = currentLevel(score);
    },
    { immediate: true },
  );

  return {
    score,
    accountLevel,
    isLoading,
  };
}
