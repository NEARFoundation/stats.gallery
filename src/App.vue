<template>
  <TopBar />
  <div class="relative py-16 bg-white overflow-hidden">
    <div class="relative px-4 sm:px-6 lg:px-8 mt-10 max-w-7xl sm:mx-auto">
      <router-view />
    </div>
  </div>
</template>

<style lang="stylus"></style>

<script lang="ts">
import TopBar from '@/components/navigation/TopBar.vue';

export default {
  components: {
    TopBar,
  },
};
</script>
