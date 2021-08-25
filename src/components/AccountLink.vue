<template>
  <router-link
    :to="{
      name: 'overview',
      params: {
        network,
        account,
      },
    }"
    class="
      whitespace-nowrap
      text-blue-700
      hover:text-blue-500
      dark:text-blue-400 dark:hover:text-blue-300
    "
  >
    <span class="text-gray-400">@</span>
    <span class="underline">{{ account }}</span>
  </router-link>
</template>

<script lang="ts">
import { useNear } from '@/composables/useNear';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    account: {
      type: String,
      required: true,
    },
  },
  setup() {
    const { network } = useNear();

    return {
      network,
    };
  },
});
</script>
