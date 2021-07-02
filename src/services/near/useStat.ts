import { nearContext } from '@/utils/near';
import { Ref, WatchSource } from 'vue';
import { usePromise } from '../usePromise';

export function useStat<T>(
  stat: string,
  defaultValue: T,
  {
    account,
    after,
    before,
  }: {
    account: Ref<string>;
    after?: Ref<number | undefined>;
    before?: Ref<number | undefined>;
  },
): {
  value: Ref<T>;
  isLoading: Ref<boolean>;
} {
  const { client } = nearContext();
  const f = () =>
    client.getSingle<T>(stat, {
      account: account.value,
      after: after?.value,
      before: before?.value,
    });
  const { value, isLoading } = usePromise(
    [account, after, before] as WatchSource[],
    f,
    defaultValue,
  );

  return { value, isLoading };
}