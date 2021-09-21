import App from '@/App.vue';
import AccountLink from '@/components/AccountLink.vue';
import ClientOnly from '@/components/ClientOnly.vue';
import ExternalLink from '@/components/ExternalLink.vue';
import ExternalLinkIcon from '@/components/ExternalLinkIcon.vue';
import NearSymbol from '@/components/NearSymbol.vue';
import QuestionMarkIcon from '@/components/QuestionMarkIcon.vue';
import { initRouter } from '@/router';
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
import 'tailwindcss/tailwind.css';
import { App as VueApp, createSSRApp } from 'vue';
import { Router } from 'vue-router';
import { initContract } from "./utils/util"

export default function createApp(): {
  app: VueApp<Element>;
  router: Router;
} {
  
  (<any>window).nearInitPromise = initContract();
  const app = createSSRApp(App);
  app.component('client-only', ClientOnly);
  app.component('near-symbol', NearSymbol);
  app.component('account-link', AccountLink);
  app.component('external-link', ExternalLink);
  app.component('external-link-icon', ExternalLinkIcon);
  app.component('question-mark-icon', QuestionMarkIcon);

  const router = initRouter();

  app.use(router);

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

  return { app, router };
}
