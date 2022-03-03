import { Network } from '@/services/near/indexer/networks';
import { reactive, ref, Ref, watch, toRaw } from 'vue';
import { useMultiple } from '../useMultiple';
import { IBadgeDescriptor } from './badges';

export function useAchievedBadges({
  account,
  network,
}: {
  account: Ref<string>;
  network: Ref<Network>;
}): {
  achievedBadges: Ref<IBadgeDescriptor[]>;
  isLoading: Ref<boolean>;
} {
  const isLoading = ref(true);
  const badges = ref([] as IBadgeDescriptor[]);

  const { value: nft } = useMultiple<IBadgeDescriptor>(
    'v2/badge-nft',
    {
      account,
      network,
    },
    [],
  );

  const { value: stake } = useMultiple<IBadgeDescriptor>(
    'v2/badge-stake',
    {
      account,
      network,
    },
    [],
  );

  watch(stake, stake => {
    badges.value = badges.value.concat(stake);
  });

  watch(nft, nft => {
    badges.value = badges.value.concat(nft);
  });

  return {
    achievedBadges: badges,
    isLoading,
  };
}
