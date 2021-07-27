<template>
  <div class="flex">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      :class="[
        modelValue.length ? 'bg-white' : 'bg-gray-100',
        `text-xl text-black
        focus:ring-green-500 focus:ring-2
        font-normal
        focus:bg-white
        block
        w-full
        outline-none
        rounded-l-sm
        p-3
        z-10`,
      ]"
      placeholder="account-name"
    />
    <span
      class="
        z-0
        inline-flex
        items-center
        px-3
        rounded-r-sm
        border border-gray-300
        bg-gray-100
        text-gray-500 text-xl
      "
      >.near</span
    >
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
  emits: ['update:modelValue'],
});
</script>
