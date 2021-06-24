<template>
  <slot :result="result" />
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

    const update = async () => {
      result.value = await client.getSingle(props.stat, {
        account: props.account,
        after: props.after,
        before: props.before,
      });
    };

    watchEffect(update);

    return { result };
  },
});
</script>
