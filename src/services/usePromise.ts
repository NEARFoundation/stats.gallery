import { ref, Ref, watch, WatchSource } from 'vue';

export function usePromise<T, U>(
  ws: WatchSource<U> | WatchSource<U>[],
  f: () => Promise<T>,
  initialValue: T,
): {
  value: Ref<T>;
  isLoading: Ref<boolean>;
} {
  const value = ref(initialValue) as Ref<T>;
  const isLoading = ref(false);

  const update = async () => {
    isLoading.value = true;
    value.value = await f();
    isLoading.value = false;
  };

  update();

  watch(ws, update);

  return { value, isLoading };
}
