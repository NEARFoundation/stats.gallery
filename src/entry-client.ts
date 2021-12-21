import { Buffer } from 'buffer';
import LogRocket from 'logrocket';
import createApp from './app';

// Necessary for @webassemblyjs/wasm-parser to work in browser
(window as any).Buffer = Buffer;

if (process.env['NODE_ENV'] === 'production') {
  LogRocket.init('near/statsgallery');
}

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

const { app } = createApp();
app.mount('#app');
