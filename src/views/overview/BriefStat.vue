<template>
  <div class="flex flex-col items-center space-y-3 p-4">
    <h5 class="font-bold">{{ title }}</h5>
    <div class="font-bold text-2xl">{{ value }}</div>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
});
</script>
