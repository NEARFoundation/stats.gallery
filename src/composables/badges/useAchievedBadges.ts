import { Network } from '@/services/near/indexer/networks';
import { reactive, ref, Ref, watch } from 'vue';
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
  const achievedBadges: Ref<IBadgeDescriptor[]> = ref([] as IBadgeDescriptor[]);
  const isLoading = ref(true);

  const { value: nft } = useMultiple<IBadgeDescriptor>(
    'v2/badge-nft',
    {
      account,
      network,
    },
    [],
  );

  watch(nft, value => {
    // for (const n of nft.value) {
    achievedBadges.value = value;
    // }
  });

  console.log('watch nft', achievedBadges);

  // badges.forEach(async badgeGroup => {
  //   const { badges, isLoading: isBadgeLoading } = badgeGroup.composable({
  //     account,
  //     network,
  //   });

  //   watch(badges, badges => {
  //     console.log(badges);
  //     // for (const b of badges) {
  //     //   if (b.achieved) {
  //     //     achievedBadges.add(b);
  //     //   } else {
  //     //     achievedBadges.delete(b);
  //     //   }
  //     // }
  //   });

  //   // for (const badge of badges.value) {
  //   //   console.log('useAchievedBadges', badge);

  //   //   watch(isBadgeLoading, isBadgeLoading => {
  //   //     if (isBadgeLoading) {
  //   //       loading.add(badge);
  //   //     } else {
  //   //       loading.delete(badge);
  //   //     }

  //   //     isLoading.value = loading.size > 0;
  //   //   });
  //   // }
  // });

  // console.log(badges);

  console.log('went here');
  return {
    achievedBadges,
    isLoading,
  };
}
