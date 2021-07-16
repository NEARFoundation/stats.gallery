import { usePreference } from '@/services/usePreference';
import { isString } from '@/utils/is';
import { Ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const NEAR_ACCOUNT_PREFERENCES_KEY = 'near-account';

export function useAccountFromUrl(): Ref<string> {
  const account = usePreference(NEAR_ACCOUNT_PREFERENCES_KEY);

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
