<template>
  <IntakeHero />
  <Overview />
  <IntakeHero />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IntakeHero from './about/IntakeHero.vue';
import Overview from './about/Overview.vue';

export default defineComponent({
  components: { IntakeHero, Overview },
});
</script>
