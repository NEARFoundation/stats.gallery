import { Ref, WatchSource } from 'vue';
import { Timeframe, timeframeToPastTimestamp } from '../timeframe';
import { usePromise } from '../usePromise';
import { NearClient } from './NearClient';
import { Network } from './networks';

export function useStat<T>(
  stat: string,
  defaultValue: T,
  {
    account,
    network,
    timeframe,
  }: {
    account: Ref<string>;
    network: Ref<Network>;
    timeframe: Ref<Timeframe>;
  },
): {
  value: Ref<T>;
  isLoading: Ref<boolean>;
} {
  const f = () =>
    NearClient.from(network.value).getSingle<T>(stat, {
      account: account.value,
      after: timeframeToPastTimestamp(timeframe.value) * 1_000_000,
    });
  const { value, isLoading } = usePromise(
    [account, network, timeframe] as WatchSource[],
    f,
    defaultValue,
  );

  return { value, isLoading };
}
