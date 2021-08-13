<template>
  <BadgeCard
    :icon="icon"
    :iconClass="iconClass"
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
import { IBadgeDescriptor } from '@/composables/badges/badges';
import { Component, defineComponent, ref, watch } from 'vue';

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
  setup(props) {
    const icon = ref(null as Component);
    const iconClass = ref('');

    watch(
      props,
      ({ badge }) => {
        switch (badge.group) {
          case 'nft':
            icon.value = NftBadge;
            iconClass.value = 'text-blue-500';
            break;
          case 'transfer':
            icon.value = TransactionBadge;
            iconClass.value = 'text-red-500';
            break;
          case 'contract':
            icon.value = FunctionBadge;
            iconClass.value = 'text-green-500';
            break;
          case 'stake':
            icon.value = FunctionBadge;
            iconClass.value = 'text-purple-500';
            break;
        }
      },
      { immediate: true },
    );

    return {
      icon,
      iconClass,
    };
  },
});
</script>
