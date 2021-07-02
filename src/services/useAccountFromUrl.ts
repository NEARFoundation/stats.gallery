import { isString } from '@/utils/is';
import { Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export function useAccountFromUrl(): {
  account: Ref<string>;
  exists: Ref<boolean>;
} {
  const account = ref('');
  const exists = ref(false);
  const route = useRoute();

  watch(
    route,
    currentRoute => {
      if (
        currentRoute.params.account &&
        isString(currentRoute.params.account)
      ) {
        account.value = currentRoute.params.account as string;
        exists.value = true;
      } else {
        exists.value = false;
      }
    },
    {
      immediate: true,
    },
  );

  return { account, exists };
}
