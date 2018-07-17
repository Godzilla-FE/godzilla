const Koa = require('koa');
const app = new Koa();
// const { render } = require('../dist/ssr_bundle');
const fs = require('fs');
const path = require('path');
const router = require('./routes');
// const cors = require('@koa/cors');
const config = require('../config');
const axios = require('axios');

// 设置请求域名
axios.defaults.baseURL = config.client.baseURL;

// app.use(cors());

// const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf8');
// const tpl = html.split('<!-- ssr -->');
// tpl[1] = tpl[1].replace('<!-- script -->', '<script>window.ssr=true</script>');

// app.use(async (ctx, next) => {
//   if (ctx.path === '/') {
//     return (ctx.body = `${tpl[0]}${render()}${tpl[1]}`);
//   }
//   await next();
// });

// app.use(require('koa-static')(path.resolve(__dirname, '../dist')));


// app.use(async (ctx, next) => {});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001);
console.log('http://127.0.0.1:3001');
