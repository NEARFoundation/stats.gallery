<template>
  <div
    class="
      flex-1
      bg-white
      dark:bg-gray-800
      rounded-md
      shadow-md
      p-5
      flex flex-col
      space-y-3
      items-center
      relative
      pt-32
      mt-24
      mx-3
      mb-8
    "
  >
    <div class="absolute w-full h-0 top-0">
      <div
        class="
          absolute
          w-full
          transform
          -translate-y-1/2
          top-0
          flex
          justify-center
        "
      >
        <slot name="image" />
      </div>
    </div>

    <header class="text-xl font-medium">{{ name }}</header>
    <p class="font-medium">{{ title }}</p>
    <p>
      <slot />
    </p>
    <blockquote class="italic px-9 pt-1 relative">
      <QuoteIcon class="w-6 text-gray-400 absolute top-0 left-0" />
      <slot name="quote" />
    </blockquote>
    <div class="flex space-x-2">
      <slot name="contact" />
    </div>
  </div>
</template>

<script lang="ts">
import QuoteIcon from '@/components/icons/QuoteIcon.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { QuoteIcon },
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
      default: '',
    },
  },
});
</script>
