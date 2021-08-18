<template>
  <div class="flex">
    <input
      :value="modelValue.toLowerCase()"
      @input="$emit('update:modelValue', $event.target.value.toLowerCase())"
      @keydown.enter="$emit('submit', $event.target.value.toLowerCase())"
      :autofocus="autofocus"
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
        rounded-sm
        p-3
        z-10`,
      ]"
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
    autofocus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'submit'],
});
</script>
