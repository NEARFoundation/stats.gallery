import About from '@/views/About.vue';
import Overview from '@/views/Overview.vue';
import Stats from '@/views/Stats.vue';
import Transactions from '@/views/Transactions.vue';
import {
  createRouter,
  createWebHistory,
  RouteLocationNormalizedLoaded,
  RouteRecordRaw,
} from 'vue-router';

export type RouteTitleGenerator = (
  route: RouteLocationNormalizedLoaded,
) => string;

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'about',
    component: About,
    meta: {
      title: 'near stats.gallery',
      noTitleSuffix: true,
    },
  },
  {
    path: '/:network/:account',
    redirect: {
      name: 'overview',
    },
  },
  {
    path: '/:network/:account/overview',
    name: 'overview',
    component: Overview,
    meta: {
      title: <RouteTitleGenerator>(
        (route =>
          `${route.params.account}'s ${route.params.network} activity overview`)
      ),
    },
  },
  {
    path: '/:network/:account/stats',
    name: 'stats',
    component: Stats,
    meta: {
      title: <RouteTitleGenerator>(
        (route => `${route.params.account}'s ${route.params.network} stats`)
      ),
    },
  },
  {
    path: '/:network/:account/transactions',
    name: 'transactions',
    component: Transactions,
    meta: {
      title: <RouteTitleGenerator>(
        (route =>
          `${route.params.account}'s ${route.params.network} transactions`)
      ),
    },
  },
  // {
  //   path: '/overview',
  //   name: 'overview',
  //   component: Overview,
  //   meta: {
  //     title: 'overview',
  //   },
  // },
  // {
  //   path: '/stats',
  //   name: 'stats',
  //   component: Charts,
  //   meta: {
  //     title: 'stats',
  //   },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
