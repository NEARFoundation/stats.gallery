<template>
  <SwitchGroup as="div" class="flex items-center cursor-pointer">
    <Switch
      :modelValue="modelValue"
      :class="[
        modelValue
          ? 'text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700'
          : 'text-current bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500',
      ]"
      class="
        inline-flex
        whitespace-nowrap
        py-1
        px-3
        rounded-md
        text-sm
        font-medium
        border border-transparent
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
      "
      @update:modelValue="$emit('update:modelValue', $event)"
    >
      <slot />
    </Switch>
  </SwitchGroup>
</template>

<script lang="ts">
import { Switch, SwitchGroup } from '@headlessui/vue';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  components: {
    Switch,
    SwitchGroup,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue'],
});
</script>
