<template>
  <div class="shadow-lg rounded-md bg-white flex flex-col">
    <header
      class="
        bg-gray-50
        px-3
        border-b-2 border-gray-200
        rounded-t-md
        flex
        items-center
      "
    >
      <span class="py-2 text-lg text-gray-800 font-bold truncate">{{
        title
      }}</span>
      <Tooltip v-if="!!$slots.help">
        <template #trigger>
          <question-mark-icon
            class="text-gray-300 mx-2 mt-1 cursor-pointer hover:text-gray-400"
          />
        </template>
        <template #content>
          <slot name="help" />
        </template>
      </Tooltip>
      <template v-if="!!$slots.action">
        <div class="flex-1 self-stretch flex items-center px-1 truncate">
          <div class="flex-1"></div>
          <slot name="action" />
        </div>
      </template>
    </header>
    <slot />
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
