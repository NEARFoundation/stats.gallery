<template>
  <slot :value="value" :isLoading="isLoading" />
</template>

<script lang="ts">
import { useStat } from '@/services/near/useStat';
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
    const { value, isLoading } = useStat(props.stat, 0, toRefs(props));

    return { value, isLoading };
  },
});
</script>
