<template>
  <slot :results="results" :isLoading="isLoading" />
</template>

<script lang="ts">
import { useRecentTransactionActions } from '@/services/near/useRecentTransactionActions';
import { defineComponent, toRefs } from 'vue';

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
    const { value, isLoading } = useRecentTransactionActions(toRefs(props));

    return { results: value, isLoading };
  },
});
</script>
