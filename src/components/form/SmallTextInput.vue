<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    @keydown.enter="$emit('submit', $event.target.value)"
    type="text"
    class="
      text-base
      font-normal
      block
      outline-none
      rounded-sm
      border
      p-2
      z-10
      text-black
      border-gray-300
      disabled:bg-slate-200 disabled:text-gray-600
      dark:bg-gray-700 dark:border-gray-600 dark:text-white
    "
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
  },
  emits: ['update:modelValue', 'submit'],
});
</script>
