<template>
  <Tooltip>
    <template #trigger>
      <slot />
    </template>
    <template #content>
      <h5 class="text-lg font-medium">{{ name }}</h5>
      <div class="text-gray-300">{{ description }}</div>
      <div class="text-sm">
        <span :class="rarityClass">{{ rarityName }}</span>
        <template v-if="fraction < 1">
          <span class="text-white"> &bull; </span>
          <strong>{{ $filters.compactNumber(fraction * 100) }}%</strong> of
          accounts have this achievement
        </template>
      </div>
    </template>
  </Tooltip>
</template>

<style scoped>
.rainbow {
  animation: rainbow linear 1.5s infinite;
}

@keyframes rainbow {
  0%,
  100% {
    color: hsl(0, 100%, 82%);
  }

  16.67% {
    color: hsl(60, 100%, 62%);
  }

  33.33% {
    color: hsl(120, 100%, 62%);
  }

  50% {
    color: hsl(180, 100%, 72%);
  }

  66.67% {
    color: hsl(240, 100%, 82%);
  }

  83.33% {
    color: hsl(300, 100%, 92%);
  }
}
</style>

<script lang="ts">
import Tooltip from '@/components/Tooltip.vue';
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: { Tooltip },
  props: {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fraction: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const rarityClass = ref('');
    const rarityName = ref('');

    watch(
      props,
      () => {
        if (props.fraction <= 0.0001) {
          rarityName.value = 'Legendary';
          rarityClass.value = 'font-medium rainbow';
        } else if (props.fraction <= 0.001) {
          rarityName.value = 'Epic';
          rarityClass.value = 'text-purple-300';
        } else if (props.fraction <= 0.01) {
          rarityName.value = 'Super Rare';
          rarityClass.value = 'text-blue-300';
        } else if (props.fraction <= 0.1) {
          rarityName.value = 'Rare';
          rarityClass.value = 'text-yellow-300';
        } else if (props.fraction <= 0.25) {
          rarityName.value = 'Uncommon';
          rarityClass.value = 'text-green-300';
        } else {
          rarityName.value = 'Common';
          rarityClass.value = 'text-gray-300';
        }
      },
      { immediate: true },
    );

    return {
      rarityName,
      rarityClass,
    };
  },
});
</script>
