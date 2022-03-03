<template>
  <BadgeCard
    v-for="(b, i) in badges"
    :key="i"
    :group="b[0].group"
    :name="b[0].badge_name"
    :description="b[0].badge_description"
    :fraction="b[0].rarity_fraction"
    :achieved="b[0].achieved"
  />
</template>

<script lang="ts">
import BadgeCard from '@/components/badges/BadgeCard.vue';
import { IBadgeDescriptor } from '@/composables/badges/badges';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  components: {
    BadgeCard,
  },
  props: {
    badges: {
      type: Object as PropType<IBadgeDescriptor>,
      required: true,
    },
  },
});
</script>
