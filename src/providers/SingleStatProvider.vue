<template>
  <slot :value="value" :isLoading="isLoading" />
</template>

<script lang="ts">
import { Network } from '@/services/near/indexer/networks';
import { useStat } from '@/services/useStat';
import { Timeframe } from '@/services/timeframe';
import { defineComponent, toRefs } from 'vue';

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
    const { value, isLoading } = useStat(props.stat, 0, toRefs(props));

    return { value, isLoading };
  },
});
</script>
