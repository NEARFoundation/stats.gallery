<template>
  <label class="flex flex-col items-center">
    <slot />
    <small class="text-gray-500 mt-1">{{ label }}</small>
  </label>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String as PropType<string>,
      required: true,
    },
  },
});
</script>
