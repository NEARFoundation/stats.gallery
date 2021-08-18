<template>
  <main
    class="
      flex-grow flex flex-col
      space-y-3
      pr-3
      md:space-y-0 md:grid md:grid-cols-3 md:grid-flow-row-dense md:gap-3
    "
  >
    <ScoreWidget class="row-span-2 order-1 md:order-none" />
    <LevelWidget class="row-span-1 order-2 md:order-none" />
    <BalanceWidget class="row-span-2 order-4 md:order-none" />
    <RankWidget class="row-span-1 order-3 md:order-none" />
    <div
      v-if="!hideEarnBanner"
      class="
        col-span-3
        order-5
        md:order-none
        cursor-default
        rounded-md
        shadow-lg
        relative
        nearkat-prompt
        flex
        h-32
        px-4
        sm:pl-6 sm:pr-16
        items-center
        sm:space-x-4
        justify-center
        sm:justify-between
      "
    >
      <button
        @click="hideEarnBanner = 'true'"
        class="absolute top-0 right-0 p-1 hover:opacity-75"
      >
        <XIcon class="w-6 h-6 text-white" />
      </button>
      <img
        class="pt-3 h-full self-end hidden lg:block"
        src="@/assets/nearkat_prompt.png"
      />
      <div class="hidden sm:block flex-shrink-0 text-white text-xl">
        <p>Complete quests.</p>
        <p>Make transactions.</p>
        <p>Buy NFTs.</p>
      </div>
      <BigChevron class="hidden md:block h-full flex-shrink py-6 text-white" />
      <div class="flex flex-col items-center space-y-4 w-64 text-white">
        <EarnNear />
        <a
          href="https://learnnear.club/"
          target="_blank"
          rel="noreferrer"
          class="
            border-2 border-white
            rounded
            px-4
            text-lg
            hover:bg-white hover:bg-opacity-10
          "
        >
          Learn more
        </a>
      </div>
    </div>
    <StatsWidget class="col-span-1 xl:col-span-2 order-6 md:order-none" />
    <TransactionRateWidget
      class="col-span-2 xl:col-span-1 order-7 md:order-none"
      style="min-height: 200px"
    />
    <!-- <DashboardCard
      class="col-span-3 order-8 md:order-none"
      title="Transaction History"
    ></DashboardCard> -->
  </main>
</template>

<style scoped>
.nearkat-prompt {
  background: linear-gradient(93.84deg, #d946ef -28.43%, #fb923c 81.44%);
}

.chart {
  min-height: 250px;
}
</style>

<script lang="ts">
import { usePreference } from '@/composables/usePreference';
import { GaugeChart } from 'echarts/charts';
import { TitleComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { XIcon } from 'heroicons-vue3/solid';
import { defineComponent } from 'vue';
import BigChevron from './overview/BigChevron.vue';
import EarnNear from './overview/EarnNear.vue';
import BalanceWidget from './overview/widgets/BalanceWidget.vue';
import LevelWidget from './overview/widgets/LevelWidget.vue';
import RankWidget from './overview/widgets/RankWidget.vue';
import ScoreWidget from './overview/widgets/ScoreWidget.vue';
import StatsWidget from './overview/widgets/StatsWidget.vue';
import TransactionRateWidget from './overview/widgets/TransactionRateWidget.vue';

use([CanvasRenderer, GaugeChart, TitleComponent]);

export default defineComponent({
  components: {
    XIcon,
    BigChevron,
    EarnNear,
    ScoreWidget,
    LevelWidget,
    RankWidget,
    BalanceWidget,
    StatsWidget,
    TransactionRateWidget,
  },
  setup() {
    const hideEarnBanner = usePreference('hide-earn-banner', '');

    return {
      hideEarnBanner,
    };
  },
});
</script>
