<template>
  <CombinedTopBar :showIntake="true" />
  <div class="p-3 mx-auto max-w-7xl flex flex-wrap">
    <header class="lg:ml-64 xl:ml-80 w-full flex-grow flex flex-wrap">
      <h1
        class="font-display font-extrabold text-4xl md:text-5xl my-1 flex-grow"
      >
        bloodninja.near
      </h1>

      <div class="sr-only">Metrics</div>
      <div class="self-center flex space-x-3">
        <Star class="text-blue-500">1</Star>
        <div
          class="
            py-1
            px-4
            bg-purple-700
            rounded-full
            flex
            justify-center
            text-white
            font-bold
          "
        >
          84
        </div>
        <div
          class="py-1 px-4 bg-white rounded-full flex justify-center font-bold"
        >
          <near-symbol class="w-5" />&nbsp;583.2564
        </div>
      </div>

      <div class="w-full mt-2"></div>

      <div class="sr-only">Badges</div>
      <div class="flex space-x-1">
        <Badge
          name="Come get some!"
          description="Send your first transaction"
          :fraction="0.97"
        >
          <TransactionBadge class="w-8 h-8 text-pink-500" />
        </Badge>
        <Badge name="One-of-a-kind" description="Buy an NFT" :fraction="0.0081">
          <NftBadge class="w-8 h-8 text-blue-500" />
        </Badge>
        <Badge
          name="Up and away!"
          description="Deploy a contract"
          :fraction="0.0006"
        >
          <FunctionBadge class="w-8 h-8 text-yellow-500" />
        </Badge>
      </div>
    </header>

    <div class="w-full mt-5 flex">
      <nav
        class="
          w-16
          md:w-52
          lg:w-64
          xl:w-80
          flex-shrink-0 flex flex-col
          space-y-2
          pr-4
        "
      >
        <SectionLink to="/overview" :icon="OverviewIcon" name="Overview" />
        <SectionLink to="/stats" :icon="StatsIcon" name="Stats" />
        <SectionLink
          to="/transactions"
          :icon="TransactionsIcon"
          name="Transactions"
        />
        <SectionLink to="/quests" :icon="QuestsIcon" name="Quests" />
        <SectionLink
          to="/leaderboards"
          :icon="LeaderboardsIcon"
          name="Leaderboards"
        />
        <hr class="w-64" />
        <SectionLink
          to="/exchange"
          :icon="ExchangeIcon"
          name="Exchange NEAR"
          external
        />
        <SectionLink to="/send" :icon="SendIcon" name="Send NEAR" external />
        <SectionLink
          to="/receive"
          :icon="ReceiveIcon"
          name="Receive NEAR"
          external
        />
        <SectionLink to="/nft" :icon="NftIcon" name="Buy NFT" external />
      </nav>

      <main
        class="
          flex-grow flex flex-col
          space-y-3
          md:space-y-0 md:grid md:grid-cols-3 md:grid-flow-row-dense md:gap-3
        "
      >
        <DashboardCard class="row-span-2 order-1 md:order-none" title="Score">
          <template #help>
            Track your activity across the network with a unified score. The
            more you participate, the higher your score grows!
          </template>
          <template #content>
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
              <div class="flex-grow flex justify-center items-center">
                <div
                  class="
                    text-2xl
                    font-bold
                    text-white
                    bg-purple-700
                    py-1
                    px-4
                    rounded-full
                  "
                >
                  84
                </div>
              </div>
              <div class="w-full flex flex-col space-y-4 items-center">
                <h4 class="w-full font-medium">Recent earnings</h4>
                <div class="w-full flex flex-col space-y-2">
                  <div class="flex">
                    <div class="flex-grow">Transaction</div>
                    <div class="text-green-500 font-bold">+1</div>
                  </div>
                  <div class="flex">
                    <div class="flex-grow">Buy an NFT</div>
                    <div class="text-green-500 font-bold">+20</div>
                  </div>
                  <div class="flex">
                    <div class="flex-grow">Send NEAR</div>
                    <div class="text-green-500 font-bold">+20</div>
                  </div>
                  <div class="flex">
                    <div class="flex-grow">Make your first transaction</div>
                    <div class="text-green-500 font-bold">+20</div>
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
                  View scores
                </button>
              </div>
            </div>
          </template>
        </DashboardCard>
        <DashboardCard class="row-span-1 order-2 md:order-none" title="Level">
          <template #help>
            Complete quests and earn points to increase your level. Try to reach
            the max!
          </template>
          <template #content>
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
        </DashboardCard>
        <DashboardCard class="row-span-2 order-4 md:order-none" title="Balance">
          <template #help>
            Monitor your current balance of NEAR and review recent transactions.
          </template>
          <template #content>
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
                <div
                  class="text-green-500 font-semibold flex py-1 items-center"
                >
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
          <template #help>
            How do you stack up against other accounts?
          </template>
          <template #content>
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
          <template #content>
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
                  <div class="flex">
                    <near-symbol class="w-5" />&nbsp;0.00041
                  </div>
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
          <template #content>
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
    </div>
  </div>
  <Footer />
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
import Footer from '@/components/Footer.vue';
import CombinedTopBar from '@/components/navigation/TopBar.vue';
import { useGaugeChart } from '@/composables/charts/useGaugeChart';
import { GaugeChart } from 'echarts/charts';
import { TitleComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { ArrowSmDownIcon, ArrowSmUpIcon, XIcon } from 'heroicons-vue3/solid';
import { defineComponent, ref } from 'vue';
import VChart from 'vue-echarts';
import Badge from './overview/badges/Badge.vue';
import FunctionBadge from './overview/badges/FunctionBadge.vue';
import NftBadge from './overview/badges/NftBadge.vue';
import TransactionBadge from './overview/badges/TransactionBadge.vue';
import BigChevron from './overview/BigChevron.vue';
import BriefStat from './overview/BriefStat.vue';
import DashboardCard from './overview/DashboardCard.vue';
import DonutChart from './overview/DonutChart.vue';
import EarnNear from './overview/EarnNear.vue';
import ExchangeIcon from './overview/icons/ExchangeIcon.vue';
import LeaderboardsIcon from './overview/icons/LeaderboardsIcon.vue';
import NftIcon from './overview/icons/NftIcon.vue';
import OverviewIcon from './overview/icons/OverviewIcon.vue';
import QuestsIcon from './overview/icons/QuestsIcon.vue';
import ReceiveIcon from './overview/icons/ReceiveIcon.vue';
import SendIcon from './overview/icons/SendIcon.vue';
import StatsIcon from './overview/icons/StatsIcon.vue';
import TransactionsIcon from './overview/icons/TransactionsIcon.vue';
import SectionLink from './overview/SectionLink.vue';
import Star from './overview/Star.vue';

use([CanvasRenderer, GaugeChart, TitleComponent]);

export default defineComponent({
  components: {
    Footer,
    CombinedTopBar,
    SectionLink,
    DashboardCard,
    Star,
    DonutChart,
    XIcon,
    BigChevron,
    EarnNear,
    ArrowSmDownIcon,
    ArrowSmUpIcon,
    BriefStat,
    VChart,
    TransactionBadge,
    NftBadge,
    FunctionBadge,
    Badge,
  },
  setup() {
    const weeklyTransactionRateOption = useGaugeChart(ref(30));

    return {
      weeklyTransactionRateOption,
      OverviewIcon,
      StatsIcon,
      TransactionsIcon,
      QuestsIcon,
      LeaderboardsIcon,
      ExchangeIcon,
      SendIcon,
      ReceiveIcon,
      NftIcon,
    };
  },
});
</script>
