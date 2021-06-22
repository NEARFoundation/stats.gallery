<template>
  <slot :value="value" />
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
    since: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const value: Ref<any> = ref(null);
    const client = inject<NearClient>('near')!;

    const update = async () => {
      value.value = await client.getSingle(props.stat, {
        account: props.account,
        since: props.since,
      });
    };

    watchEffect(update);

    return { value };
  },
});
</script>
