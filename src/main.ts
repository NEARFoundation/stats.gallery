// Import Tailwind CSS globally
import App from '@/App.vue';
import router from '@/router';
import { compactNumber } from '@/utils/compactNumber';
import { nearSymbol, toNear } from '@/utils/near';
import 'tailwindcss/tailwind.css';
import { createApp } from 'vue';

const app = createApp(App);
app.use(router).mount('#app');

app.config.globalProperties = {
  nearSymbol,
  $filters: {
    compactNumber,
    toNear,
  },
};
