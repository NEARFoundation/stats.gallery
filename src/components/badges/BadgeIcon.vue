<template>
  <div class="relative z-0">
    <!-- Make sure they always have a white background -->
    <div
      class="
        absolute
        rounded-full
        bg-white
        top-0
        left-0
        w-full
        h-full
        z-0
        transform
        scale-75
      "
    ></div>
    <component
      :is="icon[group]"
      :class="iconClass[group]"
      class="z-10 absolute"
    ></component>
    <!--
      Note: using transform/scale instead of border/ring because the component
      may be different sizes, and while relative widths & heights (e.g. w-1/4)
      will scale dynamically, borders etc. with fixed widths will not.
      This method also renders better.
    -->
    <div
      v-if="gildClass !== ''"
      class="
        absolute
        -bottom-1
        right-0
        rounded-full
        bg-white
        w-1/4
        h-1/4
        transform
        scale-150
        z-10
      "
    ></div>
    <div
      v-if="gildClass !== ''"
      class="
        absolute
        -bottom-1
        right-0
        rounded-full
        bg-gradient-to-br
        from-white
        w-1/4
        h-1/4
        transform
        scale-110
        z-10
      "
      :class="gildClass"
    ></div>
  </div>
</template>

<script lang="ts">
import { BadgeGroup } from '@/composables/badges/badges';
import { Component, defineComponent } from 'vue';
import ContractBadgeVue from './ContractBadge.vue';
import NftBadgeVue from './NftBadge.vue';
import StakeBadgeVue from './StakeBadge.vue';
import TransactionBadgeVue from './TransactionBadge.vue';

export default defineComponent({
  props: {
    group: {
      type: String as () => BadgeGroup,
      required: true,
    },
    gildClass: {
      type: String,
      default: '',
    },
  },
  setup() {
    const icon: Record<BadgeGroup, Component> = {
      nft: NftBadgeVue,
      transfer: TransactionBadgeVue,
      contract: ContractBadgeVue,
      stake: StakeBadgeVue,
    };

    const iconClass: Record<BadgeGroup, string> = {
      nft: 'text-blue-500',
      transfer: 'text-red-500',
      contract: 'text-green-700',
      stake: 'text-purple-500',
    };

    return {
      icon,
      iconClass,
    };
  },
});
</script>
