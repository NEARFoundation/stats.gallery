<template>
  <button
    v-bind="$attrs"
    class="py-2 px-4 border rounded-sm"
    :class="{
      'text-gray-800 border-gray-300 bg-gray-100 hover:bg-gray-200':
        mode === 'normal',
      'text-gray-800 border-gray-300 bg-gray-300 animate-pulse cursor-wait':
        mode === 'pending',
    }"
    :disabled="mode === 'pending'"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    mode: {
      type: String as PropType<'normal' | 'pending'>,
      default: 'normal',
    },
  },
});
</script>
