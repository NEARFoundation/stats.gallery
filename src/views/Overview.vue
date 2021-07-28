<template>
  <CombinedTopBar :showIntake="true" />
  content content content
  <Footer />
</template>

<script lang="ts">
import Footer from '@/components/Footer.vue';
import CombinedTopBar from '@/components/navigation/TopBar.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { Footer, CombinedTopBar },
});
</script>
