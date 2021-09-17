<template>
  <CombinedTopBar :showIntake="true" />
  <div class="py-3 mx-auto max-w-7xl flex flex-col">
    <header
      v-if="account"
      class="md:ml-52 lg:ml-64 xl:ml-80 flex-grow flex flex-wrap pl-3 pr-5"
    >
      <h1
        class="
          font-display font-extrabold
          text-4xl
          truncate
          md:text-5xl
          my-1
          mr-3
          flex-grow
        "
        style="line-height: 1.25"
      >
        {{ account }}
      </h1>

      <div class="flex items-center space-x-1">
        <a
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          class="twitter-share-button"
          data-size="large"
          data-text="Check out my NEAR stats!"
          data-related="NEARProtocol,sudo_build"
          data-show-count="true"
          >Tweet</a
        >
      </div>

      <div class="w-full mt-2"></div>

      <div class="sr-only">Badges</div>
      <div class="flex-grow flex items-center space-x-1 mr-5">
        <BadgeTooltip
          v-for="badge in badgeGroups"
          :key="badge.name"
          :name="badge.name"
          :description="badge.description"
          :fraction="badge.rarityFraction"
          :group="badge.group"
        />
      </div>

      <div class="sr-only">Metrics</div>
      <div class="self-center flex space-x-3">
        <Star class="text-blue-500">{{
          $filters.number.standard(accountLevel.level)
        }}</Star>
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
          {{ $filters.number.standard(score) }}
        </div>
        <div
          class="
            py-1
            px-4
            bg-white
            text-black
            rounded-full
            flex
            justify-center
            font-bold
          "
        >
          <near-symbol class="w-5" />&nbsp;{{
            $filters.number.standard(+$filters.toNear(view.amount))
          }}
        </div>
      </div>
    </header>

    <div class="w-full max-w-full mt-5 flex">
      <nav
        class="
          w-16
          md:w-52
          lg:w-64
          xl:w-80
          flex-shrink-0 flex flex-col
          space-y-2
          pl-3
        "
      >
        <SectionLink
          v-if="account && network && timeframe"
          :to="{
            name: 'overview',
            params: { account, network },
            query: { t: timeframe },
          }"
          :icon="OverviewIcon"
          name="Overview"
        />
        <SectionLink
          v-if="account && network && timeframe"
          :to="{
            name: 'stats',
            params: { account, network },
            query: { t: timeframe },
          }"
          :icon="StatsIcon"
          name="Stats"
        />
        <SectionLink
          v-if="account && network && timeframe"
          :to="{
            name: 'transactions',
            params: { account, network },
            query: { t: timeframe },
          }"
          :icon="TransactionsIcon"
          name="Transactions"
        />
        <SectionLink
          v-if="account && network && timeframe"
          :to="{
            name: 'quests',
            params: { account, network },
            query: { t: timeframe },
          }"
          :icon="QuestsIcon"
          name="Quests"
        />
        <SectionLink
          to="/leaderboards"
          :icon="LeaderboardsIcon"
          name="Leaderboards"
        />
        <hr class="w-64" />
        <SectionLink
          to="https://learnnear.club/"
          :icon="AcademicCapIcon"
          name="Learn NEAR"
          external
        />
        <SectionLink
          to="https://near-in-minutes.com/"
          :icon="ClockIcon"
          name="NEAR in Minutes"
          external
        />
        <SectionLink
          to="https://paras.id/"
          :icon="NftIcon"
          name="Buy NFTs"
          external
        />
        <div class="flex-grow"></div>
        <div class="hidden md:block">
          <div
            class="
              p-3
              border-gray-300
              dark:border-gray-700
              border-2 border-dashed
              rounded-md
              flex flex-wrap
              justify-center
              items-center
              font-medium
              text-base text-gray-400 text-center
            "
          >
            <strong>Have a suggestion?</strong>
            <p>Share your experience!</p>
            <a
              href="https://forms.gle/VsuVJsqdChBuhDdM7"
              target="_blank"
              rel="noreferrer"
              class="
                whitespace-nowrap
                m-1
                border-2 border-gray-400
                px-3
                py-1
                rounded-md
                font-medium
                flex
                items-center
                space-x-2
                hover:bg-gray-400 hover:bg-opacity-10
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-gray-500
              "
            >
              <AnnotationIcon class="w-4 h-4" />
              <span>Feedback</span>
            </a>
            <a
              href="https://github.com/NEAR-Edu/stats.gallery/issues/new/choose"
              target="_blank"
              rel="noreferrer"
              class="
                whitespace-nowrap
                m-1
                border-2 border-gray-400
                px-3
                py-1
                rounded-md
                font-medium
                flex
                items-center
                space-x-2
                hover:bg-gray-400 hover:bg-opacity-10
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-gray-500
              "
            >
              <ContactIcon class="w-4 h-4" />
              <span>Reports</span>
            </a>
          </div>
        </div>
      </nav>

      <div class="flex-1 w-0 p-5 pl-3 -mt-5">
        <slot />
        <router-view></router-view>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script lang="ts">
import BadgeTooltip from '@/components/badges/BadgeTooltip.vue';
import FunctionBadge from '@/components/badges/FunctionBadge.vue';
import NftBadge from '@/components/badges/NftBadge.vue';
import TransactionBadge from '@/components/badges/TransactionBadge.vue';
import Footer from '@/components/Footer.vue';
import ContactIcon from '@/components/icons/ContactIcon.vue';
import CombinedTopBar from '@/components/navigation/TopBar.vue';
import {
  BadgeGroup,
  badges,
  IBadgeDescriptor,
} from '@/composables/badges/badges';
import { useAchievedBadges } from '@/composables/badges/useAchievedBadges';
import { useAccountView } from '@/composables/useAccountView';
import { useNear } from '@/composables/useNear';
import { useScore } from '@/composables/useScore';
import {
  AcademicCapIcon,
  ClockIcon,
  AnnotationIcon,
} from 'heroicons-vue3/solid';
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import LeaderboardsIcon from './overview/icons/LeaderboardsIcon.vue';
import NftIcon from './overview/icons/NftIcon.vue';
import OverviewIcon from './overview/icons/OverviewIcon.vue';
import QuestsIcon from './overview/icons/QuestsIcon.vue';
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
    BadgeTooltip,
    ContactIcon,
    AnnotationIcon,
  },
  setup() {
    const { account, network, timeframe } = useNear();
    const { view } = useAccountView({
      account,
      network,
      finality: 'final',
    });
    const {
      score,
      accountLevel,
      isLoading: isScoreLoading,
    } = useScore({
      account,
      network,
      timeframe,
    });

    const { achievedBadges } = useAchievedBadges({ account, network });
    const badgeGroups = ref([] as IBadgeDescriptor[]);

    const findBestBadgeInGroup = (
      group: BadgeGroup,
      achievedBadges: Set<IBadgeDescriptor>,
    ) => {
      for (let i = badges.length - 1; i >= 0; i--) {
        const b = badges[i];
        if (b.group === group && achievedBadges.has(b)) {
          return b;
        }
      }
    };

    watch(achievedBadges, achievedBadges => {
      const nft = findBestBadgeInGroup('nft', achievedBadges) ?? [];
      const transfer = findBestBadgeInGroup('transfer', achievedBadges) ?? [];
      const contract = findBestBadgeInGroup('contract', achievedBadges) ?? [];
      const stake = findBestBadgeInGroup('stake', achievedBadges) ?? [];

      badgeGroups.value = [nft, transfer, stake, contract].flat();
    });

    const route = useRoute();

    return {
      account,
      network,
      timeframe,
      view,
      score,
      accountLevel,
      badgeGroups,
      OverviewIcon,
      StatsIcon,
      TransactionsIcon,
      QuestsIcon,
      LeaderboardsIcon,
      NftIcon,
      ClockIcon,
      AcademicCapIcon,
      TransactionBadge,
      FunctionBadge,
      NftBadge,
    };
  },
});
</script>
