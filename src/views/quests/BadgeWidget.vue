<template>
  <BadgeCard
    :icon="icon[badge.group]"
    :iconClass="iconClass[badge.group]"
    :name="badge.name"
    :description="badge.description"
    :fraction="badge.rarityFraction"
    :achieved="achieved"
  />
</template>

<script lang="ts">
import BadgeCard from '@/components/badges/BadgeCard.vue';
import FunctionBadge from '@/components/badges/FunctionBadge.vue';
import NftBadge from '@/components/badges/NftBadge.vue';
import TransactionBadge from '@/components/badges/TransactionBadge.vue';
import { BadgeGroup, IBadgeDescriptor } from '@/composables/badges/badges';
import { Component, defineComponent } from 'vue';

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
  setup() {
    const icon: Record<BadgeGroup, Component> = {
      nft: NftBadge,
      transfer: TransactionBadge,
      contract: FunctionBadge,
      stake: FunctionBadge,
    };

    const iconClass: Record<BadgeGroup, string> = {
      nft: 'text-blue-500',
      transfer: 'text-red-500',
      contract: 'text-green-500',
      stake: 'text-purple-500',
    };

    return {
      icon,
      iconClass,
    };
  },
});
</script>
