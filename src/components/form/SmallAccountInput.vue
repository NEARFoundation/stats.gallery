<template>
  <div class="flex">
    <input
      :value="modelValue.toLowerCase()"
      @input="$emit('update:modelValue', $event.target.value.toLowerCase())"
      @keydown.enter="$emit('submit', $event.target.value.toLowerCase())"
      type="text"
      class="
        text-base text-black
        focus:ring-green-500 focus:ring-2
        font-normal
        block
        w-full
        outline-none
        rounded-sm
        border border-gray-300
        p-2
        z-10
        dark:bg-gray-700 dark:border-gray-600 dark:text-white
      "
      placeholder="account-name"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'account-input',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue', 'submit'],
});
</script>
