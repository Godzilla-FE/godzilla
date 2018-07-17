let render;
let tpl;
let loadMap;

require('../build/ssr-dev-middle')(app, (bundle, str, map) => {
  // console.log(tpl);
  render = bundle;
  loadMap = map;
  buildTpl(str);
});

function buildTpl(str) {
  const strArr = str.split('<!-- ssr -->');
  strArr[1] = strArr[1].replace(
    '<!-- script -->',
    '<script>window.ssr=true</script><!-- script -->',
  );
  tpl = strArr;
}

module.exports = async (ctx, next) => {
  if (!render) {
    return (ctx.body = '等待构建...');
  }

  if (ctx.path === '/' || ctx.path === '/one' || ctx.path === '/two') {
    return (ctx.body = await render(tpl, ctx.path, loadMap));
  }
  await next();
};
