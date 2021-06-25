<template>
  <div v-if="isLoading" class="animate-pulse flex justify-center space-x-2">
    <div
      v-for="cell in cells"
      :key="cell"
      class="rounded-md bg-gray-200 h-12 w-8"
    ></div>
  </div>
  <slot v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    cells: {
      type: Number,
      default: 2,
    },
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
});
</script>
