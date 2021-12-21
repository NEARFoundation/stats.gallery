<template>
  <button
    v-bind="$attrs"
    class="
      py-2
      px-4
      border
      rounded-sm
      font-medium
      whitespace-nowrap
      inline-flex
      items-center
      text-gray-800
      border-gray-300
      bg-gray-100
      hover:bg-gray-200
      dark:text-white
      dark:border-gray-600
      dark:bg-gray-700
      dark:hover:bg-gray-600
    "
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({});
</script>
