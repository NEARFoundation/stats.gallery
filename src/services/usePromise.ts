import { ref, Ref, watch, WatchSource } from 'vue';

export function usePromise<T, U>(
  source: WatchSource<U> | WatchSource<U>[],
  f: () => Promise<T>,
  initialValue: T,
): {
  value: Ref<T>;
  isLoading: Ref<boolean>;
} {
  const value = ref(initialValue) as Ref<T>;
  const isLoading = ref(true);

  watch(
    source,
    async () => {
      isLoading.value = true;
      value.value = await f();
      isLoading.value = false;
    },
    { immediate: true },
  );

  return { value, isLoading };
}
