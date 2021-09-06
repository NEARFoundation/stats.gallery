import { ref, Ref, watch } from 'vue';

const storage: Storage | undefined =
  typeof window !== 'undefined' && 'localStorage' in window
    ? window.localStorage
    : undefined;

function put(key: string, value: string): void {
  if (storage) {
    storage.setItem(key, value);
  }
}

function get(key: string, defaultValue?: string): string | undefined {
  if (storage) {
    const value = storage.getItem(key);
    if (value !== null) {
      return value;
    }
  }

  return defaultValue ?? undefined;
}

export function usePreference<T extends string>(
  key: string,
  defaultValue?: T,
): Ref<T> {
  const value = ref(get(key, defaultValue) ?? '') as Ref<T>;

  watch(value, newValue => {
    put(key, newValue);
  });

  return value;
}
