<template>{{ hash }}</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { FinalExecutionOutcome } from 'near-api-js/lib/providers';
import { defineComponent, PropType, ref, toRefs, watch } from 'vue';

export default defineComponent({
  props: {
    hash: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const { connection, walletAuth } = useNear();
    const status = ref<FinalExecutionOutcome | null>();

    watch(
      [toRefs(props).hash, connection],
      async ([hash, connection]) => {
        const s = await connection!.connection.provider.txStatus(
          hash,
          walletAuth.accountId,
        );
        console.log({ status: s });
        status.value = s;
      },
      { immediate: true },
    );

    return { status };
  },
});
</script>
