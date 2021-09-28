import { networks } from '@/services/near/indexer/networks';
import Embed from '@/views/Embed.vue';
import Landing from '@/views/Landing.vue';
import Leaderboards from '@/views/Leaderboards.vue';
import Overview from '@/views/Overview.vue';
import BalanceWidget from '@/views/overview/widgets/BalanceWidget.vue';
import LevelWidget from '@/views/overview/widgets/LevelWidget.vue';
import RankWidget from '@/views/overview/widgets/RankWidget.vue';
import ScoreWidget from '@/views/overview/widgets/ScoreWidget.vue';
import StatsWidget from '@/views/overview/widgets/StatsWidget.vue';
import TransactionHistoryWidget from '@/views/overview/widgets/TransactionHistoryWidget.vue';
import TransactionRateWidget from '@/views/overview/widgets/TransactionRateWidget.vue';
import Page from '@/views/Page.vue';
import Quests from '@/views/Quests.vue';
import Stats from '@/views/Stats.vue';
import Story from '@/views/Story.vue';
import Transactions from '@/views/Transactions.vue';
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  NavigationGuardWithThis,
  RouteLocationNormalizedLoaded,
  RouteRecordRaw,
} from 'vue-router';

export type RouteTitleGenerator = (
  route: RouteLocationNormalizedLoaded,
) => string;

const preserveQueryString: NavigationGuardWithThis<undefined> = (
  to,
  from,
  next,
) => {
  if (
    Object.keys(from.query).length > 0 &&
    Object.keys(to.query).length === 0
  ) {
    next({ ...to, query: from.query });
  } else {
    next();
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'landing',
    component: Landing,
    meta: {
      title: 'stats.gallery',
      noTitleSuffix: true,
    },
  },
  {
    path: '/story',
    name: 'story',
    component: Story,
    meta: {
      title: 'the story behind stats.gallery',
      noTitleSuffix: true,
    },
  },
  {
    path: '/leaderboards',
    name: 'leaderboards',
    component: Page,
    children: [
      {
        path: '',
        component: Leaderboards,
      },
    ],
    meta: {
      title: 'leaderboards',
      noTitleSuffix: true,
    },
  },
  {
    path: '/embed/:network(' + Object.keys(networks).join('|') + ')/:account',
    component: Embed,
    children: [
      {
        path: 'balance',
        name: 'embed:balance',
        component: BalanceWidget,
      },
      {
        path: 'level',
        name: 'embed:level',
        component: LevelWidget,
      },
      {
        path: 'rank',
        name: 'embed:rank',
        component: RankWidget,
      },
      {
        path: 'score',
        name: 'embed:score',
        component: ScoreWidget,
      },
      {
        path: 'stats',
        name: 'embed:stats',
        component: StatsWidget,
      },
      {
        path: 'transaction-history',
        name: 'embed:transaction-history',
        component: TransactionHistoryWidget,
      },
      {
        path: 'transaction-rate',
        name: 'embed:transaction-rate',
        component: TransactionRateWidget,
      },
    ],
  },
  {
    path: '/:network(' + Object.keys(networks).join('|') + ')/:account',
    component: Page,
    children: [
      {
        path: '',
        redirect: {
          name: 'overview',
        },
        strict: true,
      },
      {
        path: 'overview',
        name: 'overview',
        component: Overview,
        beforeEnter: [preserveQueryString],
        meta: {
          title: <RouteTitleGenerator>(
            (route =>
              `${route.params.account}'s ${route.params.network} activity overview`)
          ),
        },
      },
      {
        path: 'stats',
        name: 'stats',
        component: Stats,
        beforeEnter: [preserveQueryString],
        meta: {
          title: <RouteTitleGenerator>(
            (route => `${route.params.account}'s ${route.params.network} stats`)
          ),
        },
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: Transactions,
        beforeEnter: [preserveQueryString],
        meta: {
          title: <RouteTitleGenerator>(
            (route =>
              `${route.params.account}'s ${route.params.network} transactions`)
          ),
        },
      },
      {
        path: 'quests',
        name: 'quests',
        component: Quests,
        beforeEnter: [preserveQueryString],
        meta: {
          title: <RouteTitleGenerator>(
            (route =>
              `${route.params.account}'s ${route.params.network} quests`)
          ),
        },
      },
    ],
  },
];

export function initRouter() {
  return createRouter({
    history:
      // Are we doing SSR right now?
      typeof window === 'undefined'
        ? createMemoryHistory()
        : createWebHistory(),
    routes,
  });
}
