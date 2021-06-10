import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Activity from '../views/Activity.vue';

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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
