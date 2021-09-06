// import Koa from 'koa';
// import Router from '@koa/router';
// import fs from 'fs';
// import path from 'path';
// import { renderToString } from '@vue/server-renderer';
// import serve from 'koa-static';
const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const { renderToString } = require('@vue/server-renderer');
// const manifest = require('./dist/ssr/ssr-manifest.json');
const serve = require('koa-static');

console.log(Object.keys(process.env));

(async () => {
  const distPath = './dist/';

  const ssrPath = path.join(distPath, './ssr/');
  const clientPath = path.join(distPath, './client/');

  const manifest = JSON.parse(
    fs.readFileSync(path.join(ssrPath, './ssr-manifest.json')),
  );
  const appPath = path.join(ssrPath, manifest['index.js']);
  console.log('appPath', appPath);
  const createApp = require(path.join(__dirname, appPath)).default;
  console.log(createApp);

  const server = new Koa();

  const htmlPath = path.join(clientPath, './index.html');

  console.log(htmlPath);

  const html = fs.readFileSync(htmlPath, {
    encoding: 'utf-8',
  });

  server.use(async (ctx, next) => {
    console.log(ctx.path);
    // // TODO: 404
    console.log(
      'server.js',
      Object.keys(process.env).find(x => x.startsWith('VUE_APP_')),
    );
    const { app, router: appRouter } = createApp();
    console.log('done');

    const matched = appRouter.resolve(ctx.path).matched;
    const matches = matched.length > 0;

    if (matches) {
      await appRouter.push(ctx.path);
      await appRouter.isReady();

      console.log('rendering...');
      const rendered = (await renderToString(app)).toString() + '';
      console.log('rendered');

      // const trimmed = rendered.replace(/(^<!--\[-->)|(<!--\]-->$)/g, '');

      const injected = html.replace(
        '<div id="app">',
        '<div id="app">' + rendered,
      );
      ctx.body = injected;
      ctx.status = 200;
      ctx.set('content-type', 'text/html');
    } else {
      await next();
    }

    // await next();
  });

  server.use(serve(clientPath, { defer: true }));

  const port = process.env['PORT'] || 8005;
  console.log('Listening on port ' + port + '...');
  server.listen(port);
})();
