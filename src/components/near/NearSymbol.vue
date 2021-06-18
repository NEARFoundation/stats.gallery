<template>
  {{ nearCurrencySymbol }}
</template>

<script lang="ts">
import { nearCurrencySymbol } from '@/utils/near';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {
      nearCurrencySymbol,
    };
  },
});
</script>
