<template>
  <Tooltip
    class="
      text-gray-400 text-opacity-80
      cursor-pointer
      p-2
      rounded-sm
      hover:text-opacity-100 hover:bg-gray-500 hover:bg-opacity-10
    "
  >
    <template #trigger>
      <question-mark-icon class="w-4 h-4" />
    </template>
    <template #content>
      <slot />
    </template>
  </Tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Tooltip from './Tooltip.vue';

export default defineComponent({
  components: {
    Tooltip,
  },
});
</script>
