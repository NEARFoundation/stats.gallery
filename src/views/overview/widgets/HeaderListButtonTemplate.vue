<template>
  <div
    class="flex flex-col items-center p-3 space-y-4 justify-between flex-grow"
  >
    <div class="h-20 flex justify-center items-center">
      <slot name="header" />
    </div>
    <div class="w-full flex-grow flex flex-col items-center">
      <h4 class="w-full font-medium mb-2">{{ listTitle }}</h4>
      <div
        v-if="!empty"
        class="w-full grid grid-flow-row gap-1 mb-2"
        style="grid-template-columns: auto min-content"
      >
        <slot />
      </div>
      <div v-else class="text-center text-gray-500 italic">
        {{ emptyText }}
      </div>
      <button
        v-if="!empty"
        class="
          mt-auto
          cursor-pointer
          bg-gray-200
          dark:bg-gray-700
          hover:bg-gray-300
          dark:hover:bg-gray-900
          px-2
          rounded-sm
          truncate
        "
        @click="$emit('expand')"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['expand'],
  props: {
    listTitle: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    empty: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: 'Nothing to show',
    },
  },
});
</script>
