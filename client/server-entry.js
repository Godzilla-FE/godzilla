import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
// import { StaticRouter } from 'react-router-dom';
import App from './App';
import Dynamic from 'godzilla/dynamic';
import { getBundles } from 'godzilla/dynamic/webpack';
// import { renderRoutes, matchRoutes } from 'react-router-config';
import routes from './routes';
import path from 'path';
import { matchRoutes, renderRoutes } from 'godzilla/router';
import ServerRouter, { loadRouteData } from 'godzilla/router/server';

// 导出渲染函数，以给采用 Node.js 编写的 HTTP 服务器代码调用
export async function render(tpl, url, stats) {
  // 把根组件渲染成 HTML 字符串
  await Dynamic.preloadAll();
  // console.log(1);
  const ssrData = await loadRouteData(url, routes);

  const context = {};
  let modules = [];
  const html = renderToString(
    <Dynamic.Capture report={(moduleName) => modules.push(moduleName)}>
      <ServerRouter context={context} location={url} data={ssrData}>
        {renderRoutes(routes)}
      </ServerRouter>
    </Dynamic.Capture>,
  );

  let bundles = getBundles(stats, modules);

  const cssList = [];
  // 将按需加载的js文件引入

  tpl = tpl.replace('<!-- script -->', function() {
    return bundles
      .filter((bundle) => {
        return bundle.file.indexOf('.map') === -1;
      })
      .filter((bundle) => {
        // 开发环境需要去掉hot-update.js
        return bundle.file.indexOf('hot-update.js') === -1;
      })
      .map((bundle) => {
        if (path.extname(bundle.file) === '.js') {
          return `<script src="${bundle.publicPath}"></script>`;
        } else if (path.extname(bundle.file) === '.css') {
          cssList.push(`<link href="${bundle.publicPath}" rel="stylesheet">`);
          return;
        }
        console.error('不支持的bundle', bundle);
      })
      .concat([`<script>window._godzillaData=${JSON.stringify(ssrData)};window.ssr=true;</script>`])
      .join('');
  });

  // 清空请求数据
  tpl = tpl.replace('<!-- ssr -->', html);
  tpl = tpl.replace('<!-- style -->', cssList.join('\n'));

  return tpl;
}
