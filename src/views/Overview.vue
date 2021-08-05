<template>
  <Page>
    <main
      class="
        flex-grow flex flex-col
        space-y-3
        md:space-y-0 md:grid md:grid-cols-3 md:grid-flow-row-dense md:gap-3
      "
    >
      <ScoreWidget class="row-span-2 order-1 md:order-none" />
      <LevelWidget class="row-span-1 order-2 md:order-none" />
      <!-- <DashboardCard class="row-span-1 order-2 md:order-none" title="Level">
        <template #help>
          Complete quests and earn points to increase your level. Try to reach
          the max!
        </template>
        <template #default>
          <div
            class="
              flex flex-col
              items-center
              justify-center
              flex-grow
              p-3
              space-y-2
            "
          >
            <div class="flex space-x-2 items-center">
              <Star class="text-blue-500">1</Star>
              <div class="font-bold text-2xl">Beginner</div>
            </div>
            <div class="flex w-full items-center space-x-2">
              <span class="text-gray-500 text-lg">84</span>
              <div
                class="
                  flex-grow
                  bg-gray-200
                  h-2
                  rounded-full
                  relative
                  flex
                  overflow-hidden
                "
              >
                <div
                  class="bg-purple-500 rounded-full"
                  style="width: 33%"
                ></div>
              </div>
              <span class="text-gray-500 text-lg">500</span>
            </div>
          </div>
        </template>
      </DashboardCard> -->
      <DashboardCard class="row-span-2 order-4 md:order-none" title="Balance">
        <template #help>
          Monitor your current balance of NEAR and review recent transactions.
        </template>
        <template #default>
          <div
            class="
              flex flex-col
              items-center
              p-3
              space-y-4
              justify-between
              flex-grow
            "
          >
            <div class="flex-grow flex flex-col justify-center items-center">
              <div class="text-2xl font-bold flex py-1">
                <near-symbol class="w-8 h-8" />&nbsp;583.2564
              </div>
              <div class="text-green-500 font-semibold flex py-1 items-center">
                +23.256
              </div>
            </div>
            <div class="w-full flex flex-col space-y-4 items-center">
              <h4 class="w-full font-medium">Recent transfers</h4>
              <div class="w-full flex flex-col space-y-2">
                <div class="flex">
                  <div class="flex-1 overflow-ellipsis overflow-hidden">
                    @account.near
                  </div>
                  <div class="text-red-500 font-bold">&minus;151</div>
                </div>
                <div class="flex">
                  <div class="flex-1 overflow-ellipsis overflow-hidden">
                    @anotheraccount.near
                  </div>
                  <div class="text-green-500 font-bold">+223.3245</div>
                </div>
                <div class="flex">
                  <div class="flex-1 overflow-ellipsis overflow-hidden">
                    @earn.near
                  </div>
                  <div class="text-green-500 font-bold">+2000</div>
                </div>
                <div class="flex">
                  <div class="flex-1 overflow-ellipsis overflow-hidden">
                    @longaccountname.near
                  </div>
                  <div class="text-red-500 font-bold">&minus;1322.435</div>
                </div>
              </div>
              <button
                class="
                  mt-5
                  cursor-pointer
                  bg-gray-200
                  hover:bg-gray-300
                  px-2
                  rounded-sm
                  truncate
                "
              >
                View transfers
              </button>
            </div>
          </div>
        </template>
      </DashboardCard>
      <DashboardCard class="row-span-1 order-3 md:order-none" title="Rank">
        <template #help> How do you stack up against other accounts? </template>
        <template #default>
          <div
            class="
              flex
              items-center
              flex-grow
              p-3
              flex-row flex-wrap
              justify-center
            "
          >
            <div class="flex-grow">
              <div class="text-2xl font-bold text-center">#123,456</div>
              <div class="text-green-500 font-bold text-center">+2</div>
            </div>
            <div class="relative p-2">
              <DonutChart
                :fraction="0.05"
                :trackThickness="20"
                :thickness="20"
                lineCap="round"
                color="rgb(124, 58, 237)"
                trackColor="rgb(226, 232, 240)"
                class="w-20 h-20"
              />
              <div
                class="
                  absolute
                  top-0
                  left-0
                  w-full
                  h-full
                  flex
                  items-center
                  justify-center
                "
              >
                <div class="font-bold text-lg">5%</div>
              </div>
            </div>
          </div>
        </template>
      </DashboardCard>
      <div
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
        <button class="absolute top-0 right-0 p-1 hover:opacity-75">
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
        <BigChevron
          class="hidden md:block h-full flex-shrink py-6 text-white"
        />
        <div class="flex flex-col items-center space-y-4 w-64 text-white">
          <EarnNear />
          <button
            class="
              border-2 border-white
              rounded
              px-4
              text-lg
              hover:bg-white hover:bg-opacity-10
            "
          >
            Learn more
          </button>
        </div>
      </div>
      <DashboardCard
        class="col-span-1 xl:col-span-2 order-6 md:order-none"
        title="Brief Stats"
      >
        <template #help>
          A quick look at your account across time. What a journey!
        </template>
        <template #default>
          <div class="flex-grow flex items-center">
            <div
              class="
                flex-grow flex flex-col
                items-center
                sm:flex-row sm:items-start
                flex-wrap
                justify-around
              "
            >
              <BriefStat title="Transactions sent" value="138">
                <div class="flex justify-between self-stretch">
                  <div class="flex flex-col items-center">
                    <div>
                      <ArrowSmDownIcon
                        class="inline align-text-top w-5 text-gray-400"
                      />
                      <span class="text-green-500 font-semibold">135</span>
                    </div>
                    <small>Incoming</small>
                  </div>
                  <div class="flex flex-col items-center">
                    <div>
                      <ArrowSmUpIcon
                        class="inline align-text-top w-5 text-gray-400"
                      />
                      <span class="text-red-500 font-semibold">3</span>
                    </div>
                    <small>Outgoing</small>
                  </div>
                </div>
              </BriefStat>
              <BriefStat title="Gas burned" value="4.1 Tgas">
                <div class="flex"><near-symbol class="w-5" />&nbsp;0.00041</div>
              </BriefStat>
              <BriefStat title="Days with NEAR" value="34 days &#128588;">
                <p>Since Jun 03, 2021</p>
              </BriefStat>
            </div>
          </div>
        </template>
      </DashboardCard>
      <DashboardCard
        class="col-span-2 xl:col-span-1 order-7 md:order-none"
        title="Weekly Transaction Rate"
      >
        <template #help>
          This is the number of transactions you've sent over the past 7 days.
          Are you cookin', cruisin', or crawlin'?
        </template>
        <template #default>
          <div class="flex flex-1">
            <VChart
              class="chart flex-shrink"
              theme="light"
              :option="weeklyTransactionRateOption"
              autoresize
            />
          </div>
        </template>
      </DashboardCard>
      <DashboardCard
        class="col-span-3 order-8 md:order-none"
        title="Transaction History"
      ></DashboardCard>
    </main>
  </Page>
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
import { useGaugeChart } from '@/composables/charts/useGaugeChart';
import { GaugeChart } from 'echarts/charts';
import { TitleComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { ArrowSmDownIcon, ArrowSmUpIcon, XIcon } from 'heroicons-vue3/solid';
import { defineComponent, ref } from 'vue';
import VChart from 'vue-echarts';
import BigChevron from './overview/BigChevron.vue';
import BriefStat from './overview/BriefStat.vue';
import DashboardCard from './overview/DashboardCard.vue';
import DonutChart from './overview/DonutChart.vue';
import EarnNear from './overview/EarnNear.vue';
import LevelWidget from './overview/widgets/LevelWidget.vue';
import ScoreWidget from './overview/widgets/ScoreWidget.vue';
import Page from './Page.vue';

use([CanvasRenderer, GaugeChart, TitleComponent]);

export default defineComponent({
  components: {
    DashboardCard,
    DonutChart,
    XIcon,
    BigChevron,
    EarnNear,
    ArrowSmDownIcon,
    ArrowSmUpIcon,
    BriefStat,
    VChart,
    Page,
    ScoreWidget,
    LevelWidget,
  },
  setup() {
    const weeklyTransactionRateOption = useGaugeChart(ref(13));

    return {
      weeklyTransactionRateOption,
    };
  },
});
</script>
