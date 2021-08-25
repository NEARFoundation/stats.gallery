<template>
  <TopBar />
  <IntakeHero />
  <Overview />
  <IntakeHero />
  <Footer />
</template>

<script lang="ts">
import Footer from '@/components/Footer.vue';
import TopBar from '@/components/navigation/TopBar.vue';
import { defineComponent } from 'vue';
import IntakeHero from './landing/IntakeHero.vue';
import Overview from './landing/Overview.vue';

export default defineComponent({
  components: {
    IntakeHero,
    Overview,
    TopBar,
    Footer,
  },
});
</script>
