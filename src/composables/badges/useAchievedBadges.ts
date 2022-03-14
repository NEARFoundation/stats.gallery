import { Network } from '@/services/near/indexer/networks';
import { ref, Ref, watch } from 'vue';
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

  const { value: transfer } = useMultiple<IBadgeDescriptor>(
    'v2/badge-transfer',
    {
      account,
      network,
    },
    [],
  );

  const { value: deploy } = useMultiple<IBadgeDescriptor>(
    'v2/badge-deploy',
    {
      account,
      network,
    },
    [],
  );

  watch([nft, stake, transfer, deploy], ([nft, stake, transfer, deploy]) => {
    // considered using toRaw in this but it lacks "traditional" array properties
    // so this is a very painful experience that makes me averse to use vue again
    const rawNFTBadges = JSON.parse(JSON.stringify(nft));
    const rawStakingBadges = JSON.parse(JSON.stringify(stake));
    const rawTransferBadges = JSON.parse(JSON.stringify(transfer));
    const rawTransferDeploy = JSON.parse(JSON.stringify(deploy));

    badges.value = rawNFTBadges.result
      .concat(rawStakingBadges.result)
      .concat(rawTransferBadges.result)
      .concat(rawTransferDeploy.result);
  });

  return {
    achievedBadges: badges,
    isLoading,
  };
}
