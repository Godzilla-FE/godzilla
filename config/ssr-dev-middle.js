const path = require('path');
const webpack = require('webpack');
const MFS = require('memory-fs');
const clientConfig = require('./webpack.config');
const serverConfig = require('./webpack.server.config');
const realFs = require('fs');

module.exports = function setupDevServer(app, cb) {
  let bundle;
  let template;
  let loadmap;

  clientConfig.entry = ['webpack-hot-middleware/client?reload=true', clientConfig.entry];

  const clientCompiler = webpack(clientConfig);
  const devMiddleware = require('./middleware/devMiddleware.js')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'silent',
    // stats: {
    //   colors: true,
    // },
  });
  app.use(devMiddleware);

  clientCompiler.hooks.done.tap('done', (stats) => {
    stats = stats.toJson();
    stats.errors.forEach((err) => console.error(err));
    stats.warnings.forEach((err) => console.warn(err));
    const fs = devMiddleware.fileSystem;
    const filePath = path.join(clientConfig.output.path, 'index.html');
    const mapPath = path.join(clientConfig.output.path, 'react-loadable.json');
    if (fs.existsSync(filePath)) {
      template = fs.readFileSync(filePath, 'utf-8');
      loadmap = JSON.parse(realFs.readFileSync(mapPath, 'utf-8'));

      console.log(`静态文件编译完毕，耗时:${stats.time}ms`);
      if (bundle) {
        cb(bundle, template, loadmap);
      }
    }
  });
  return 
  // hot middleware
  app.use(require('./middleware/hotMiddleware.js')(clientCompiler));

  // watch and update server renderer
  const serverCompiler = webpack(serverConfig);
  // const mfs = new MFS();
  // app.use((ctx, next) => {
  //   next();
  // });
  // serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    stats.errors.forEach((err) => console.error(err));
    stats.warnings.forEach((err) => console.warn(err));

    // 先清除上一个缓存
    const cachePath = require.resolve('../dist/ssr_bundle');
    delete require.cache[cachePath];
    let ssr;
    try {
      ssr = require('../dist/ssr_bundle');
    } catch (error) {
      console.error('server-entry:\n', error);
      return;
    }

    bundle = ssr.render;
    // {
    //   const module = {
    //     export: () => {},
    //   };
    //   try {
    //     eval(mfs.readFileSync(bundlePath, 'utf-8'));
    //   } catch (error) {
    //     return;
    //   }

    //   bundle = module.exports.render;
    // }
    console.log(`服务端文件构建完毕，耗时:${stats.time}ms`);
    if (template) {
      cb(bundle, template, loadmap);
    }
  });
};
