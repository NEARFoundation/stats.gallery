<template>
  <Navigation></Navigation>
  <router-view />
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
