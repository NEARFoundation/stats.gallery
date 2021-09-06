const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  outputDir: 'dist',
  pages: {
    index: {
      entry: 'src/entry-client.ts',
      title: 'stats.gallery',
    },
  },
  chainWebpack: webpackConfig => {
    // if (process.env.SSR) {
    //   console.log('ssr mode');
    //   config.plugins.delete('html-index');
    //   config.plugins.delete('copy');
    //   // config.plugin('copy').tap(args => {
    //   //   args[0].patterns[0].to = path.join(__dirname, 'ssr/dist');
    //   //   return args;
    //   // });
    //   config.entry('index').delete();
    //   config.entry('ssr').add(path.join(__dirname, '/src/ssr.ts'));
    //   config.output.path(path.join(__dirname, 'ssr')).filename('[name].js');
    //   config.target('node');
    // }

    // We need to disable cache loader, otherwise the client build
    // will used cached components from the server build
    webpackConfig.module.rule('vue').uses.delete('cache-loader');
    webpackConfig.module.rule('js').uses.delete('cache-loader');
    webpackConfig.module.rule('ts').uses.delete('cache-loader');
    webpackConfig.module.rule('tsx').uses.delete('cache-loader');

    // webpackConfig.resolve.alias
    //   .set('echarts', path.join(__dirname, 'node_modules/echarts'));
    // .set('echarts/charts', 'echarts')
    // .set('echarts/components', 'echarts')
    // .set('echarts/renderers', 'echarts');

    if (!process.env.SSR) {
      // Point entry to your app's client entry file
      // webpackConfig.entry('app').clear().add('./src/main.ts');

      // webpackConfig.externals({
      //   echarts: 'echarts',
      //   'echarts/core': 'echarts',
      //   'echarts/charts': 'echarts',
      //   'echarts/components': 'echarts',
      //   'echarts/renderers': 'echarts',
      // });
      return;
    }

    // Point entry to your app's server entry file
    webpackConfig.entry('index').clear().add('./src/entry-server.ts');

    // This allows webpack to handle dynamic imports in a Node-appropriate
    // fashion, and also tells `vue-loader` to emit server-oriented code when
    // compiling Vue components.
    webpackConfig.target('node');
    // This tells the server bundle to use Node-style exports
    webpackConfig.output.libraryTarget('commonjs2');

    webpackConfig
      .plugin('manifest')
      .use(new WebpackManifestPlugin({ fileName: 'ssr-manifest.json' }));

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // Externalize app dependencies. This makes the server build much faster
    // and generates a smaller bundle file.

    // Do not externalize dependencies that need to be processed by webpack.
    // You should also whitelist deps that modify `global` (e.g. polyfills)
    webpackConfig.externals(nodeExternals({ allowlist: /\.(css|vue)$/ }));

    webpackConfig.optimization.splitChunks(false).minimize(false);

    webpackConfig.plugins.delete('preload');
    webpackConfig.plugins.delete('prefetch');
    webpackConfig.plugins.delete('progress');
    webpackConfig.plugins.delete('friendly-errors');

    webpackConfig.plugin('limit').use(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    );
  },
};
