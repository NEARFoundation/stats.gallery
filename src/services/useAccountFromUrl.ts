import { isString } from '@/utils/is';
import { Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export function useAccountFromUrl(): Ref<string> {
  const account = ref('');
  const route = useRoute();

  watch(
    route,
    currentRoute => {
      if (
        currentRoute.params.account &&
        isString(currentRoute.params.account)
      ) {
        account.value = currentRoute.params.account as string;
      }
    },
    {
      immediate: true,
    },
  );

  return account;
}
