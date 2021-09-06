<template>
  <slot v-if="isClient" v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'client-only',
  setup() {
    const isClient = ref(false);

    onMounted(() => {
      isClient.value = true;
    });

    return {
      isClient,
    };
  },
});
</script>
