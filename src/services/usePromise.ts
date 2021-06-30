import { ref, Ref, watch, WatchSource } from 'vue';

export function usePromise<T, U>(
  ws: WatchSource<U> | WatchSource<U>[],
  f: () => Promise<T>,
  defaultValue: T,
): {
  value: Ref<T>;
  isLoading: Ref<boolean>;
} {
  const value = ref(defaultValue) as Ref<T>;
  const isLoading = ref(false);

  const update = async () => {
    isLoading.value = true;
    value.value = await f();
    isLoading.value = false;
  };

  watch(ws, update);

  return { value, isLoading };
}
