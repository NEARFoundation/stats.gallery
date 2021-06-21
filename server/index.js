const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const { createPool } = require('slonik');
const routes = require('./routes');

const app = new Koa();
app.listen(process.env['PORT'] || 3000);
app.use(cors());

const router = new Router();

// Testnet
// const connection =
//   'postgres://public_readonly:nearprotocol@35.184.214.98/testnet_explorer';
// Mainnet
// const connection =
//   'postgres://public_readonly:nearprotocol@104.199.89.51/mainnet_explorer';

// Environment variable
const connection = process.env['DB_CONNECTION'];

console.log('Connection', connection);

const pool = createPool(connection);

routes.forEach(route => {
  router.get('/' + route.path, async (ctx, next) => {
    console.log('/' + route.path);
    console.log('Request', ctx.request);
    try {
      const result = await pool.connect(connection => {
        return connection.any(route.query(ctx.query));
      });
      console.log('Response', result);

      ctx.response.body = JSON.stringify(result);
    } catch (e) {
      console.log(e);
      ctx.response.status = 500;
    }
  });
});

app.use(router.routes()).use(router.allowedMethods());

console.log('Waiting for requests...');
