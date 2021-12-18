<template>
  <slot />
  <div :id="id"></div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue';

let uniqueId = 0;

export default defineComponent({
  setup() {
    const id = 'teleport-' + uniqueId++;

    provide('localTeleport', '#' + id);

    return {
      id,
    };
  },
});
</script>
