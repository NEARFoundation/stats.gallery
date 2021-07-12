<template>
  <TopBar />
  <div class="relative overflow-hidden">
    <div class="relative px-4 sm:px-6 lg:px-8 mt-10 max-w-7xl sm:mx-auto">
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component
            :is="Component"
            :key="route.meta.usePathKey ? route.path : undefined"
          />
        </keep-alive>
      </router-view>
    </div>
  </div>
  <Footer />
</template>

<script lang="ts">
import Footer from '@/components/Footer.vue';
import TopBar from '@/components/navigation/TopBar.vue';
import { RouteTitleGenerator } from '@/router';
import { provideNear } from '@/services/provideNear';
import { useTitle } from '@/services/useTitle';
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';

export default defineComponent({
  components: {
    TopBar,
    RouterView,
    Footer,
  },
  setup() {
    provideNear();

    const titleSuffix = ' - near stats.gallery';

    useTitle(route => {
      if (typeof route.meta.title === 'function') {
        return (route.meta.title as RouteTitleGenerator)(route) + titleSuffix;
      } else {
        return (route.meta.title as string) + titleSuffix;
      }
    });
  },
});
</script>
