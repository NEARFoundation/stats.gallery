<template>
  <CombinedTopBar :showIntake="true" />
  <div class="p-3 mx-auto max-w-7xl flex flex-wrap">
    <header class="ml-80 w-full flex-grow flex flex-wrap">
      <h1 class="font-extrabold text-5xl flex-grow">bloodninja.near</h1>

      <div class="sr-only">Metrics</div>
      <div class="self-center flex space-x-3">
        <div
          class="
            py-1
            px-4
            bg-blue-500
            rounded-full
            flex
            justify-center
            text-white
            font-bold
          "
        >
          1
        </div>
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
          class="
            py-1
            px-4
            bg-white
            rounded-full
            flex
            justify-center
            text-black
            font-bold
          "
        >
          <near-symbol />&nbsp;583.2564
        </div>
      </div>

      <div class="w-full mt-2"></div>

      <div class="sr-only">Badges</div>
      <div class="flex space-x-3">
        <div class="w-6 h-6 bg-pink-500 rounded-md transform rotate-45"></div>
        <div class="w-6 h-6 bg-blue-500 rounded-md transform rotate-45"></div>
        <div class="w-6 h-6 bg-yellow-500 rounded-md transform rotate-45"></div>
      </div>
    </header>

    <div class="w-full mt-4 flex">
      <nav class="w-80 flex flex-col space-y-3">
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
        <hr />
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

      <main class="flex-grow grid grid-cols-3 grid-flow-row-dense gap-3">
        <div class="row-span-2 shadow-lg rounded-md bg-white">
          <header class="bg-gray-50 py-2 px-3 border-b border-gray-200 flex">
            <span class="text-lg text-gray-800 font-bold">Score</span>
            <question-mark-icon
              class="text-gray-300 mx-2 cursor-pointer hover:text-gray-400"
            />
          </header>
          <div class="flex flex-col items-center p-3 space-y-4">
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
              "
            >
              View all score earnings
            </button>
          </div>
        </div>
        <div class="row-span-1 border-2 border-blue-500 p-2">level</div>
        <div class="row-span-2 border-2 border-blue-500 p-2">balance</div>
        <div class="row-span-1 border-2 border-blue-500 p-2">rank</div>
        <div class="col-span-3 border-2 border-blue-500 p-2">earn near</div>
        <div class="col-span-2 border-2 border-blue-500 p-2">brief stats</div>
        <div class="col-span-1 border-2 border-blue-500 p-2">
          weekly transactions rate
        </div>
        <div class="col-span-3 border-2 border-blue-500 p-2">
          transactions history
        </div>
      </main>
    </div>
  </div>
  <Footer />
</template>

<script lang="ts">
import Footer from '@/components/Footer.vue';
import CombinedTopBar from '@/components/navigation/TopBar.vue';
import { defineComponent } from 'vue';
import LeaderboardsIcon from './overview/LeaderboardsIcon.vue';
import OverviewIcon from './overview/OverviewIcon.vue';
import QuestsIcon from './overview/QuestsIcon.vue';
import SectionLink from './overview/SectionLink.vue';
import StatsIcon from './overview/StatsIcon.vue';
import TransactionsIcon from './overview/TransactionsIcon.vue';
import ExchangeIcon from './overview/ExchangeIcon.vue';
import SendIcon from './overview/SendIcon.vue';
import ReceiveIcon from './overview/ReceiveIcon.vue';
import NftIcon from './overview/NftIcon.vue';

export default defineComponent({
  components: {
    Footer,
    CombinedTopBar,
    SectionLink,
  },
  setup() {
    return {
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
