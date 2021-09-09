<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  setup() {
    onMounted(() => {
      const el: HTMLElement | null = window.document.querySelector('#app > *');

      // Best solution I could come up with because unscoped <style>s apply to
      // the whole page
      if (el) {
        el.style.width = '100vw';
        el.style.height = '100vh';
      }
    });
  },
});
</script>
