import { nearContext } from '@/utils/near';
import { Ref, WatchSource } from 'vue';
import { usePromise } from '../usePromise';
import { UnifiedTransactionAction } from './types';

export function useRecentActions({
  account,
  after,
  before,
}: {
  account: Ref<string>;
  after?: Ref<number | undefined>;
  before?: Ref<number | undefined>;
}): {
  actions: Ref<UnifiedTransactionAction[]>;
  isLoading: Ref<boolean>;
} {
  const { client } = nearContext();
  const f = () =>
    client.getRecentTransactionActions({
      account: account.value,
      after: after?.value,
      before: before?.value,
    });
  const { value: actions, isLoading } = usePromise(
    [account, after, before] as WatchSource[],
    f,
    [],
  );

  return { actions, isLoading };
}
