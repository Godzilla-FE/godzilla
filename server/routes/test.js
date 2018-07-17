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
  ctx.body = {
    a: 1111,
  };
});

module.exports = router;
