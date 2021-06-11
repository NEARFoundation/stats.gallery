<template>
  <Navigation></Navigation>
  <div class="relative py-16 bg-white overflow-hidden">
    <div class="relative px-4 sm:px-6 lg:px-8">
      <router-view />
    </div>
  </div>
</template>

<style lang="stylus"></style>

<script>
import Navigation from '@/components/Navigation.vue';

export default {
  components: {
    Navigation,
  },
};
</script>
