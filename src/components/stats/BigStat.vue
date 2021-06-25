<template>
  <div class="flex flex-col">
    <dt class="order-2 mt-2 text-lg leading-6 font-medium text-indigo-400">
      <slot name="name"></slot>
    </dt>
    <dd class="order-1 text-5xl font-extrabold text-gray-800">
      <BigStatLoading :isLoading="isLoading">
        <slot name="value"></slot>
      </BigStatLoading>
    </dd>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BigStatLoading from './BigStatLoading.vue';

export default defineComponent({
  components: { BigStatLoading },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
