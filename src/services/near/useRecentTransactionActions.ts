import { inject, Ref, WatchSource } from 'vue';
import { usePromise } from '../usePromise';
import { NearClient } from './NearClient';

export function useRecentTransactionActions({
  account,
  after,
  before,
}: {
  account: Ref<string>;
  after?: Ref<number | undefined>;
  before?: Ref<number | undefined>;
}) {
  const client = inject<NearClient>('near')!;
  const f = () =>
    client.getRecentTransactionActions({
      account: account.value,
      after: after?.value,
      before: before?.value,
    });
  const { value, isLoading } = usePromise(
    [account, after, before] as WatchSource<any>[],
    f,
    [],
  );

  return { value, isLoading };
}
