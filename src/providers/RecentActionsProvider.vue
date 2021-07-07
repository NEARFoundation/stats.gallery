<template>
  <slot :actions="actions" :isLoading="isLoading" />
</template>

<script lang="ts">
import { Network } from '@/services/near/indexer/networks';
import { useRecentActions } from '@/services/near/indexer/useRecentActions';
import { Timeframe } from '@/services/timeframe';
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  props: {
    account: {
      type: String,
      required: true,
    },
    network: {
      type: String as () => Network,
      required: true,
    },
    timeframe: {
      type: String as () => Timeframe,
      required: true,
    },
  },
  setup(props) {
    const { actions, isLoading } = useRecentActions(toRefs(props));

    return { actions, isLoading };
  },
});
</script>
