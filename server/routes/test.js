const Router = require('koa-router');
const router = new Router();

function delay(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, num);
  });
}

router.get('/test', async (ctx, next) => {
  // await delay(1000);
  const num = parseInt(ctx.cookies.get('num') || 1);
  ctx.cookies.set('num', num + 1);
  ctx.body = {
    a: num,
  };
});

module.exports = router;
