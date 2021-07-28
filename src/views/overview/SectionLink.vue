<template>
  <router-link :to="to" v-slot="{ href, navigate, isActive }">
    <a
      :class="[
        isActive
          ? 'text-gray-700 bg-white'
          : 'text-gray-500 hover:bg-gray-300 hover:bg-opacity-25 hover:text-gray-600',
        'font-medium w-64 rounded-full flex',
      ]"
      :href="href"
      @click="navigate"
    >
      <div class="rounded-l-full py-1 pl-4 pr-3 flex">
        <component :is="icon" class="w-6"></component>
      </div>
      <div class="flex-grow rounded-r-full py-3 flex items-center">
        {{ name }}
        <external-link-icon class="text-gray-400 ml-2" v-if="external" />
      </div>
    </a>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, Component } from 'vue';

export default defineComponent({
  props: {
    to: {
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
  },
});
</script>
