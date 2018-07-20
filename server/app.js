const Koa = require('koa');
const app = new Koa();
const router = require('./routes');
const cors = require('@koa/cors');
const config = require('../config');


if (process.env.NODE_ENV === 'development') {
  const { devServer, init } = require('./devServer');
  app.use(devServer);
  init(app);
} else {
  app.use(require('./serverRender'));
  app.use(require('koa-static')(path.resolve(__dirname, '../dist')));
}

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001);
console.log('http://127.0.0.1:3001');
