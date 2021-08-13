<template>
  <div
    class="
      flex flex-col
      relative
      overflow-hidden
      bg-white
      shadow-lg
      rounded-md
      p-3
    "
  >
    <div
      v-if="achieved"
      class="absolute top-0 right-0 pointer-events-none quest-completed"
    >
      <span
        class="
          absolute
          top-1/2
          left-1/2
          transform
          -translate-x-1/2 -translate-y-1/2
          ml-3
          -mt-3
        "
      >
        <CheckIcon class="text-white w-6" />
      </span>
    </div>
    <div class="flex space-x-3 flex-grow">
      <component :is="icon" :class="iconClass" class="w-12 h-12" />
      <div class="flex flex-col">
        <h4 class="font-bold text-lg">{{ name }}</h4>
        <p>{{ description }}</p>
      </div>
    </div>
    <span
      :class="rarityClass"
      class="
        px-2
        uppercase
        text-white
        font-bold
        text-xs
        rounded
        self-start
        mt-3
      "
      >{{ rarityName }}</span
    >
    <p v-if="fraction < 1" class="text-gray-600 text-sm mt-1">
      <strong>{{ $filters.number.compact(fraction * 100) }}%</strong> of users
      have this achievement
    </p>
  </div>
</template>

<style scoped>
.quest-completed {
  border-width: 30px;
  border-color: transparent;
  border-top-color: rgb(7, 165, 86);
  border-right-color: rgb(7, 165, 86);
}

.rainbow {
  animation: rainbow linear 1.5s infinite;
}

@keyframes rainbow {
  0%,
  100% {
    background-color: hsl(0, 100%, 52%);
  }

  16.67% {
    background-color: hsl(60, 100%, 37%);
  }

  33.33% {
    background-color: hsl(120, 100%, 32%);
  }

  50% {
    background-color: hsl(180, 100%, 34%);
  }

  66.67% {
    background-color: hsl(240, 100%, 52%);
  }

  83.33% {
    background-color: hsl(300, 100%, 52%);
  }
}
</style>

<script lang="ts">
import { CheckIcon } from 'heroicons-vue3/solid';
import { Component, defineComponent, ref, watch } from 'vue';

export default defineComponent({
  components: {
    CheckIcon,
  },
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
    icon: {
      type: Object as () => Component,
      // required: true,
    },
    iconClass: {
      type: String,
      default: '',
    },
    achieved: {
      type: Boolean,
      default: false,
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
          rarityClass.value = 'rainbow';
        } else if (props.fraction <= 0.001) {
          rarityName.value = 'Epic';
          rarityClass.value = 'bg-purple-500';
        } else if (props.fraction <= 0.01) {
          rarityName.value = 'Super Rare';
          rarityClass.value = 'bg-blue-500';
        } else if (props.fraction <= 0.1) {
          rarityName.value = 'Rare';
          rarityClass.value = 'bg-yellow-500';
        } else if (props.fraction <= 0.25) {
          rarityName.value = 'Uncommon';
          rarityClass.value = 'bg-green-600';
        } else {
          rarityName.value = 'Common';
          rarityClass.value = 'text-gray-500 ring-1 ring-gray-300';
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
