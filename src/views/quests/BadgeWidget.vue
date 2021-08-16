<template>
  <BadgeCard
    :group="badge.group"
    :name="badge.name"
    :description="badge.description"
    :fraction="badge.rarityFraction"
    :achieved="achieved"
  />
</template>

<script lang="ts">
import BadgeCard from '@/components/badges/BadgeCard.vue';
import { IBadgeDescriptor } from '@/composables/badges/badges';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    BadgeCard,
  },
  props: {
    badge: {
      type: Object as () => IBadgeDescriptor,
      required: true,
    },
    achieved: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
