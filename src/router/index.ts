import About from '@/views/About.vue';
import Activity from '@/views/Activity.vue';
import Charts from '@/views/Charts.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

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
      title: 'Charts',
    },
  },
  {
    path: '/:network/:account',
    name: 'activity',
    component: Activity,
    meta: {
      title: 'Activity',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'About',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
