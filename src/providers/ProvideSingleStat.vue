<template>
  <slot :result="result" :isLoading="isLoading" />
</template>

<script lang="ts">
import { NearClient } from '@/services/near/NearClient';
import { defineComponent, inject, Ref, ref, watchEffect } from 'vue';

export default defineComponent({
  props: {
    stat: {
      type: String,
      required: true,
    },
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
    const result: Ref<any> = ref(null);
    const client = inject<NearClient>('near')!;
    const isLoading = ref(false);

    const update = async () => {
      isLoading.value = true;
      result.value = await client.getSingle(props.stat, {
        account: props.account,
        after: props.after,
        before: props.before,
      });
      isLoading.value = false;
    };

    watchEffect(update);

    return { result, isLoading };
  },
});
</script>
