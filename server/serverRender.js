const fs = require('fs');
const path = require('path');

const { render } = require('../dist/ssr_bundle');
const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf8');
const loadMap = require('../dist/react-loadable.json');

module.exports = async function serverRender(ctx, next) {
  if (ctx.path === '/' || ctx.path === '/one' || ctx.path === '/two') {
    return (ctx.body = await render(html, ctx.path, loadMap));
  }
  await next();
};
