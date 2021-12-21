import { isString } from '@/utils/is';
import { ref, Ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export function useTransactionResultFromUrl(): {
  transactionHashes: Ref<string[]>;
  errorCode: Ref<string | undefined>;
  errorMessage: Ref<string | undefined>;
} {
  const transactionHashes = ref<string[]>([]);
  const errorCode = ref<string>();
  const errorMessage = ref<string>();

  const route = useRoute();

  watch(
    route,
    currentRoute => {
      const t = currentRoute.query.transactionHashes;

      if (isString(t)) {
        transactionHashes.value = t.split(',');
      } else if (t) {
        transactionHashes.value = t.map(x => x + '');
      } else {
        transactionHashes.value = [];
      }

      errorCode.value = (currentRoute.query.errorCode as string) ?? undefined;
      errorMessage.value =
        (currentRoute.query.errorMessage as string) ?? undefined;
    },
    {
      immediate: true,
    },
  );

  return { transactionHashes, errorCode, errorMessage };
}
