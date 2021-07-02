import Activity from '@/views/Activity.vue';
import Charts from '@/views/Charts.vue';
import Help from '@/views/Help.vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'help' },
  },
  {
    path: '/activity/:account',
    name: 'activity',
    component: Activity,
    meta: {
      title: 'Activity',
    },
  },
  {
    path: '/charts/:account',
    name: 'charts',
    component: Charts,
    meta: {
      title: 'Charts',
    },
  },
  {
    path: '/help',
    name: 'help',
    component: Help,
    meta: {
      title: 'Help',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
