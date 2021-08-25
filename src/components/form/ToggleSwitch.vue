<template>
  <SwitchGroup as="div" class="flex items-center cursor-pointer">
    <SwitchLabel as="span" class="pr-2">
      <span class="hidden sm:block text-sm font-medium text-gray-900"
        >Light</span
      >
      <SunIcon class="block sm:hidden w-6 text-gray-400" />
    </SwitchLabel>
    <Switch
      :modelValue="modelValue"
      :class="[
        modelValue ? 'bg-gray-500' : 'bg-gray-300',
        'relative inline-flex flex-shrink-0 h-6 w-11 border-4 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
      ]"
      @update:modelValue="$emit('update:modelValue', $event)"
    >
      <span class="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        :class="[
          modelValue ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
        ]"
      />
    </Switch>
    <SwitchLabel as="span" class="pl-2">
      <span class="hidden sm:block text-sm font-medium text-gray-900"
        >Dark</span
      >
      <MoonIcon class="block sm:hidden w-6 text-gray-600" />
    </SwitchLabel>
  </SwitchGroup>
</template>

<script lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue';
import { defineComponent } from '@vue/runtime-core';
import { MoonIcon, SunIcon } from 'heroicons-vue3/outline';

export default defineComponent({
  components: {
    Switch,
    SwitchGroup,
    SwitchLabel,
    MoonIcon,
    SunIcon,
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
