import { Network } from '@/services/near/indexer/networks';
import { OptionalRef } from '@/utils/deref';
import { Ref } from 'vue';

export type BadgeComposable = (args: {
  account: OptionalRef<string>;
  network: OptionalRef<Network>;
}) => {
  achieved: Ref<boolean>;
  isLoading: Ref<boolean>;
};
