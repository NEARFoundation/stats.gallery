<template>
  <input
    :value="modelValue.toLowerCase()"
    @input="$emit('update:modelValue', $event.target.value.toLowerCase())"
    @keydown.enter="$emit('submit', $event.target.value.toLowerCase())"
    type="text"
    :class="[modelValue.length ? 'bg-white' : 'bg-gray-100']"
    class="
      text-xl text-black
      font-normal
      block
      w-full
      outline-none
      rounded-sm
      p-3
      z-10
    "
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
