import App from '@/App.vue';
import AccountLink from '@/components/AccountLink.vue';
import ExternalLink from '@/components/ExternalLink.vue';
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
app.component('external-link', ExternalLink);
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

const nearAscii = `
     .,,,.                     .,,.     
   .dXWWN0c.                 .oKWWXd.   
   cNMMMMMWO;               ,OWMMMMNc   
   lWMMMMMMMNd.           .cKMWWMMMWl   
   lWMMWkdXMMWKl.        .dNNOlxWMMWl   
   lWMMNc ,kNMMWO;      ;OXx;. cNMMWl   
   lWMMNc  .c0WMMNx'   ,xo'    cNMMWl   
   lWMMNc    .oXMMMKkl...      cNMMWl           NEAR Protocol
   lWMMNc      ,kNMMMWO;       cNMMWl   
   lWMMNc       .:0WMMMNx'     cNMMWl   Infrastructure for Innovation
   lWMMNc     .:' .o0XMMWKl.   cNMMWl   
   lWMMNc   ,d0d.   .,kNMMWO;  cNMMWl   
   lWMMNl.:kNKc.      .:0WMMNx,lNMMWl   
   lWMMWK0WWO,          .oXMMWXXWMMWl   
   lWMMMMMNd.             ,kNMMMMMMWl   
   ;KMMMMKc.               .:0WMMMMK;   
    ,oxxl'                   .cdxxo,    
                                        `;

console.log(nearAscii);

const bannerStyle =
  'font-size: 16px;' +
  'font-family: "DM Sans", Source Sans Pro, Helvetica, Helvetica Neue, sans-serif;' +
  'font-weight: bold;' +
  'background: #3399dd;' +
  'background: linear-gradient(to right, #3399dd, #f18);' +
  'color: white;' +
  'text-shadow: 1px 1px 1px black;' +
  'text-align: center;' +
  'padding: 10px 15px;' +
  'width: 100%;';

console.log('%cNEAR is hiring!', bannerStyle);

console.log('▶▶ Apply now ▶▶');
console.log('https://near.org/careers/');
