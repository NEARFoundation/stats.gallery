import { Network } from '@/services/near/indexer/networks';
import { reactive, ref, Ref, watch } from 'vue';
import { badges, IBadgeDescriptor } from './badges';

export function useAchievedBadges({
  account,
  network,
}: {
  account: Ref<string>;
  network: Ref<Network>;
}): {
  achievedBadges: Set<IBadgeDescriptor>;
  isLoading: Ref<boolean>;
} {
  const achievedBadges = reactive(new Set<IBadgeDescriptor>());
  const isLoading = ref(true);

  const loading = new Set<IBadgeDescriptor>();

  badges.forEach(badge => {
    const { achieved, isLoading: isBadgeLoading } = badge.composable({
      account,
      network,
    });

    watch(achieved, achieved => {
      if (achieved) {
        achievedBadges.add(badge);
      } else {
        achievedBadges.delete(badge);
      }
    });

    watch(isBadgeLoading, isBadgeLoading => {
      if (isBadgeLoading) {
        loading.add(badge);
      } else {
        loading.delete(badge);
      }

      isLoading.value = loading.size > 0;
    });
  });

  return {
    achievedBadges,
    isLoading,
  };
}
