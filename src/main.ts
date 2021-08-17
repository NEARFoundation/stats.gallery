import App from '@/App.vue';
import AccountLink from '@/components/AccountLink.vue';
import ExternalLinkIcon from '@/components/ExternalLinkIcon.vue';
import NearSymbol from '@/components/NearSymbol.vue';
import QuestionMarkIcon from '@/components/QuestionMarkIcon.vue';
import router from '@/router';
import { timeframeToPastTimestamp } from '@/services/timeframe';
import { humanizeActionKind, humanizeLevel } from '@/utils/humanize';
import {
  nearSymbol,
  nearTimestampToISO,
  nearTimestampToLocaleString,
  toNear,
} from '@/utils/near';
import {
  compactNumber,
  percentNumber,
  standardNumber,
} from '@/utils/numberFormat';
import LogRocket from 'logrocket';
import 'tailwindcss/tailwind.css';
import { createApp } from 'vue';

if (process.env['NODE_ENV'] === 'production') {
  LogRocket.init('near/statsgallery');
}

const app = createApp(App);
app.component('near-symbol', NearSymbol);
app.component('account-link', AccountLink);
app.component('external-link-icon', ExternalLinkIcon);
app.component('question-mark-icon', QuestionMarkIcon);

app.use(router).mount('#app');

app.config.globalProperties = {
  nearSymbol,
  $filters: {
    number: {
      compact: compactNumber,
      standard: standardNumber,
      percent: percentNumber,
    },
    humanize: {
      actionKind: humanizeActionKind,
      level: humanizeLevel,
    },
    toNear,
    nearTimestampToLocaleString,
    nearTimestampToISO,
    timeframeToPastTimestamp,
  },
};
