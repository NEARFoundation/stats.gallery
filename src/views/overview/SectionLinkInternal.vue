<template>
  <a
    :class="[
      isActive
        ? 'text-gray-700 bg-white dark:text-white dark:bg-gray-600'
        : 'text-gray-500 dark:text-gray-300 hover:bg-gray-400 hover:bg-opacity-10',
      'font-medium w-16 md:w-60 rounded-l-full lg:rounded-full flex',
    ]"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
    :href="href"
  >
    <div class="rounded-l-full py-3 pl-4 pr-3 flex">
      <component :is="icon" class="w-6"></component>
    </div>
    <div class="hidden md:flex flex-grow rounded-r-full py-3 items-center">
      {{ name }}
      <external-link-icon class="text-gray-400 ml-2" v-if="external" />
    </div>
  </a>
</template>

<script lang="ts">
import { defineComponent, Component } from 'vue';

export default defineComponent({
  props: {
    href: {
      type: String,
      required: true,
    },
    icon: {
      type: Object as () => Component,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    external: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
