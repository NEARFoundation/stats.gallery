import App from '@/App.vue';
import router from '@/router';
import { timeframeToPastTimestamp } from '@/services/timeframe';
import { compactNumber } from '@/utils/compactNumber';
import {
  nearSymbol,
  nearTimestampToISO,
  nearTimestampToLocaleString,
  toNear,
} from '@/utils/near';
import LogRocket from 'logrocket';
import 'tailwindcss/tailwind.css';
import { createApp } from 'vue';

if (process.env['NODE_ENV'] === 'production') {
  LogRocket.init('near/statsgallery');
}

const app = createApp(App);
app.use(router).mount('#app');

app.config.globalProperties = {
  nearSymbol,
  $filters: {
    compactNumber,
    toNear,
    nearTimestampToLocaleString,
    nearTimestampToISO,
    timeframeToPastTimestamp,
  },
};
