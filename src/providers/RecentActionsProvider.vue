<template>
  <slot :actions="value" :isLoading="isLoading" />
</template>

<script lang="ts">
import { useRecentActions } from '@/services/near/useRecentActions';
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
    return useRecentActions(toRefs(props));
  },
});
</script>
