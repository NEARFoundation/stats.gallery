<template>
  <div class="shadow-lg rounded-md bg-white flex flex-col">
    <header
      class="bg-gray-50 py-2 px-3 border-b-2 border-gray-200 rounded-t-md flex"
    >
      <span class="text-lg text-gray-800 font-bold truncate">{{ title }}</span>
      <question-mark-icon
        class="text-gray-300 mx-2 cursor-pointer hover:text-gray-400"
      />
    </header>
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
  },
});
</script>
