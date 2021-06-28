import Activity from '@/views/Activity.vue';
import Charts from '@/views/Charts.vue';
import Help from '@/views/Help.vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'activity' },
  },
  {
    path: '/activity',
    name: 'activity',
    component: Activity,
  },
  {
    path: '/charts',
    name: 'charts',
    component: Charts,
  },
  {
    path: '/help',
    name: 'help',
    component: Help,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
