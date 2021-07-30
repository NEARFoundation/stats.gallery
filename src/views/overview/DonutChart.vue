<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 118 118">
    <g transform-origin="center center" transform="rotate(-90) scale(.8)">
      <circle
        cx="50%"
        cy="50%"
        r="50%"
        fill="transparent"
        :stroke="trackColor"
        :stroke-width="trackThickness"
        :stroke-dasharray="Math.PI * 100 + '%'"
        style="transition: all 1.2s cubic-bezier(0.57, 0.13, 0.18, 0.98) 0s"
      ></circle>
      <circle
        fill="transparent"
        cx="50%"
        cy="50%"
        r="50%"
        :stroke="color"
        :stroke-width="thickness"
        :stroke-dashoffset="(1 - fraction) * Math.PI * 100 + '%'"
        :stroke-dasharray="Math.PI * 100 + '%'"
        :stroke-linecap="lineCap"
        style="transition: all 1.2s cubic-bezier(0.57, 0.13, 0.18, 0.98) 0s"
      ></circle>
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    thickness: {
      type: Number,
      default: 10,
    },
    trackThickness: {
      type: Number,
      default: 10,
    },
    color: {
      type: String,
      default: 'blue',
    },
    trackColor: {
      type: String,
      default: '#ddd',
    },
    lineCap: {
      type: String as () => 'round' | 'square',
      default: 'square',
    },
    fraction: {
      type: Number,
      required: true,
    },
  },
});
</script>
