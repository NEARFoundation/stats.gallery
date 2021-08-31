const { createSSRApp } = require('vue');
const { renderToString } = require('@vue/server-renderer');

const app = createSSRApp({
  data: () => ({ msg: 'hello' }),
  template: `<div>{{ msg }}</div>`,
});

(async () => {
  const html = await renderToString(app);
  console.log(html);
})();

// const { createSSRApp } = require('vue');

// const app = createSSRApp({
//     data: () => ({ msg: 'hello' }),
//   template: `<div>{{ msg }}</div>`

// });

// const { renderToString } = require('@vue/server-renderer');

// (async () => {
//   console.log(app);
//   console.log(await renderToString(app));
// })();
