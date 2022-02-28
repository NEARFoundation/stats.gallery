<template>
  <BadgeCard
    :group="badge.group"
    :name="badge.badge_name"
    :description="badge.badge_description"
    :fraction="badge.rarity_fraction"
    :achieved="achieved"
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
    badge: {
      type: Object as PropType<IBadgeDescriptor>,
      required: true,
    },
    achieved: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    console.log('badge widget props', props.badge);
  },
});
</script>
