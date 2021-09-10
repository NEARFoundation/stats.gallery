<template>
  <main class="flex-grow flex flex-col space-y-3">
    <h2 class="text-2xl text-gray-600 dark:text-gray-300 font-medium">
      Collect achievements and get rewarded!
    </h2>
    <div
      class="
        grid grid-flow-row grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-3
        space-y-3
      "
      style="grid-auto-rows: 1fr"
    >
      <BadgeWidget
        v-for="(badge, i) in badges"
        :key="i"
        :badge="badge"
        :achieved="achievedBadges.has(badge)"
      />
      <div
        class="
          flex
          justify-center
          items-center
          p-3
          border-2 border-gray-300
          dark:border-gray-700
          border-dashed
          rounded-md
        "
      >
        <p class="font-medium text-lg text-gray-400 text-center">
          New achievements coming soon&hellip;
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.quest-completed {
  border-width: 30px;
  border-color: transparent;
  border-top-color: rgb(7, 165, 86);
  border-right-color: rgb(7, 165, 86);
}
</style>

<script lang="ts">
import { badges } from '@/composables/badges/badges';
import { useAchievedBadges } from '@/composables/badges/useAchievedBadges';
import { useNear } from '@/composables/useNear';
import { defineComponent } from 'vue';
import BadgeWidget from './quests/BadgeWidget.vue';

export default defineComponent({
  components: {
    BadgeWidget,
  },
  setup() {
    const { account, network } = useNear();
    const { achievedBadges, isLoading } = useAchievedBadges({
      account,
      network,
    });

    return {
      badges,
      achievedBadges,
      isLoading,
    };
  },
});
</script>
