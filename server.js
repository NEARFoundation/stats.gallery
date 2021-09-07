const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const { renderToString } = require('@vue/server-renderer');
const serve = require('koa-static');
const { performance } = require('perf_hooks');

(async () => {
  const distPath = './dist/';

  const ssrPath = path.join(distPath, './ssr/');
  const clientPath = path.join(distPath, './client/');

  const manifest = JSON.parse(
    fs.readFileSync(path.join(ssrPath, './ssr-manifest.json')),
  );
  const appPath = path.join(ssrPath, manifest['index.js']);
  const createApp = require(path.join(__dirname, appPath)).default;

  const server = new Koa();

  const htmlPath = path.join(clientPath, './index.html');

  const html = fs.readFileSync(htmlPath, {
    encoding: 'utf-8',
  });

  server.use(async (ctx, next) => {
    console.log(ctx.path);
    // TODO: 404
    const { app, router: appRouter } = createApp();

    const matched = appRouter.resolve(ctx.path).matched;
    const matches = matched.length > 0;

    if (matches) {
      await appRouter.push(ctx.path);
      await appRouter.isReady();

      console.log('rendering...');
      const start = performance.now();
      const rendered = (await renderToString(app)).toString() + '';
      const end = performance.now();
      console.log('rendered in ', end - start);

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
  });

  server.use(serve(clientPath, { defer: true }));

  const port = process.env['PORT'] || 8005;
  console.log('Listening on port ' + port + '...');
  server.listen(port);
})();
