<template>
  <teleport
    :to="autoTeleport || fallback"
    :disabled="!autoTeleport && !fallback"
  >
    <slot />
  </teleport>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from 'vue';

export default defineComponent({
  props: {
    fallback: {
      type: String as PropType<string>,
      default: '',
    },
  },
  setup() {
    const autoTeleport = inject<string>('autoTeleport');

    return {
      autoTeleport,
    };
  },
});
</script>
