<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    @keydown.enter="$emit('submit', $event.target.value)"
    type="text"
    class="
      text-base
      focus:ring-green-500 focus:ring-2
      font-normal
      block
      outline-none
      rounded-sm
      border
      p-2
      z-10
      disabled:bg-green-500
    "
    :class="{
      'text-black border-gray-300': theme !== 'dark',
      'dark:bg-gray-700 dark:border-gray-600 dark:text-white':
        theme !== 'dark' && theme !== 'light',
      'bg-gray-700 border-gray-600 text-white': theme === 'dark',
    }"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    theme: {
      type: String as PropType<'dark' | 'light' | 'auto'>,
      default: 'auto',
    },
  },
  emits: ['update:modelValue', 'submit'],
});
</script>
