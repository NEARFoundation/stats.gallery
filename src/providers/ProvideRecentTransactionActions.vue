<template>
  <slot :results="results" />
</template>

<script lang="ts">
import { NearClient } from '@/services/near/NearClient';
import { defineComponent, inject, Ref, ref, watchEffect } from 'vue';

export default defineComponent({
  props: {
    account: {
      type: String,
      required: true,
    },
    after: {
      type: Number,
      required: false,
    },
    before: {
      type: Number,
      required: false,
    },
  },
  setup(props) {
    const results: Ref<any> = ref(null);
    const client = inject<NearClient>('near')!;

    const update = async () => {
      results.value = await client.getRecentTransactionActions({
        account: props.account,
        after: props.after,
        before: props.before,
      });
    };

    watchEffect(update);

    return { results };
  },
});
</script>
