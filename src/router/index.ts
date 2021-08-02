import About from '@/views/About.vue';
import Activity from '@/views/Activity.vue';
import Charts from '@/views/Charts.vue';
import Overview from '@/views/Overview.vue';
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
    redirect: { name: 'about' },
  },
  {
    path: '/:network/:account/charts',
    name: 'charts',
    component: Charts,
    meta: {
      title: <RouteTitleGenerator>(
        (route => `${route.params.account}'s ${route.params.network} charts`)
      ),
    },
  },
  {
    path: '/:network/:account',
    name: 'activity',
    component: Activity,
    meta: {
      title: <RouteTitleGenerator>(
        (route => `${route.params.account}'s ${route.params.network} activity`)
      ),
    },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'about',
    },
  },
  {
    path: '/overview',
    name: 'overview',
    component: Overview,
    meta: {
      title: 'overview',
    },
  },
  {
    path: '/stats',
    name: 'stats',
    component: Charts,
    meta: {
      title: 'stats',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
