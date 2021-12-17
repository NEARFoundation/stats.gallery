<template>
  <teleport
    :to="localTeleport || fallback"
    :disabled="!localTeleport && !fallback"
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
    const localTeleport = inject<string>('localTeleport');

    return {
      localTeleport,
    };
  },
});
</script>
