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
          name="Join the party!"
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

      <slot />
    </div>
  </div>
  <Footer />
</template>

<script lang="ts">
import Footer from '@/components/Footer.vue';
import CombinedTopBar from '@/components/navigation/TopBar.vue';
import { defineComponent } from 'vue';
import Badge from './overview/badges/Badge.vue';
import FunctionBadge from './overview/badges/FunctionBadge.vue';
import NftBadge from './overview/badges/NftBadge.vue';
import TransactionBadge from './overview/badges/TransactionBadge.vue';
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

export default defineComponent({
  components: {
    Footer,
    CombinedTopBar,
    SectionLink,
    Star,
    TransactionBadge,
    NftBadge,
    FunctionBadge,
    Badge,
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
