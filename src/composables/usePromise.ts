import { onMounted, ref, Ref, watch, WatchSource } from 'vue';

export function usePromise<T>(
  source: WatchSource | WatchSource[],
  f: () => Promise<T>,
  initialValue: T,
): {
  value: Ref<T>;
  isLoading: Ref<boolean>;
} {
  const value = ref(initialValue) as Ref<T>;
  const isLoading = ref(true);

  onMounted(() => {
    watch(
      source,
      async () => {
        isLoading.value = true;
        value.value = await f();
        isLoading.value = false;
      },
      { immediate: true },
    );
  });

  return { value, isLoading };
}
