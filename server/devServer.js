const devMiddle = require('../build/ssr-dev-middle');

/**
 * 开发配置
 */
let render;
let tpl;
let loadMap;

async function devServer(ctx, next) {
  if (!render) {
    return (ctx.body = '等待构建...');
  }

  if (ctx.path === '/' || ctx.path === '/one' || ctx.path === '/two') {
    return (ctx.body = await render(tpl, ctx.url, loadMap));
  }
  await next();
}
function devServerInit(app) {
  devMiddle(app, (bundle, str, map) => {
    render = bundle;
    loadMap = map;
    tpl = str;
  });
}

module.exports = {
  init: devServerInit,
  devServer,
};
