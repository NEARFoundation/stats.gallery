<template>
  <div class="shadow-lg rounded-md bg-white flex flex-col">
    <header
      class="
        bg-gray-50
        py-2
        px-3
        border-b-2 border-gray-200
        rounded-t-md
        flex
        items-center
      "
    >
      <span class="text-lg text-gray-800 font-bold truncate">{{ title }}</span>
      <Tooltip>
        <template #trigger>
          <question-mark-icon
            class="text-gray-300 mx-2 mt-1 cursor-pointer hover:text-gray-400"
          />
        </template>
        <template #content>
          <slot name="help" />
        </template>
      </Tooltip>
    </header>
    <slot name="content" />
  </div>
</template>

<script lang="ts">
import Tooltip from '@/components/Tooltip.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { Tooltip },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>
