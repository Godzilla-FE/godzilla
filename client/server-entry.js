import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../client/App';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { renderRoutes, matchRoutes } from 'react-router-config';
import rawRoutes from './routes';
import http from 'axios';
import path from 'path';

function warpAsyncData(WrappedComponent, dataId) {
  return class Warp extends Component {
    static displayName = `warpAsyncData`;
    render() {
      const data = dataList[dataId] || {};
      return <WrappedComponent {...this.props} {...data} />;
    }
  };
}

// TODO: ssr并发时，如何处理数据
let dataList = {};
let id = 0;
function warpRoutes(routes) {
  for (const route of routes) {
    route.dataId = id++;
    route.queryAsyncData = route.component.queryAsyncData;
    route.component = warpAsyncData(route.component, route.dataId);
    if (route.routes && route.routes.length >= 1) {
      route.routes = warpRoutes(route.routes);
    }
  }
  return routes;
}

const loadBranchData = (url, routes) => {
  const branch = matchRoutes(routes, url);
  const promises = branch.map(({ route, match }) => {
    return route.queryAsyncData
      ? route.queryAsyncData(match).then((data) => {
          dataList[route.dataId] = data;
        })
      : Promise.resolve(null);
  });

  return Promise.all(promises);
};
const routes = warpRoutes(rawRoutes);
// 导出渲染函数，以给采用 Node.js 编写的 HTTP 服务器代码调用
export async function render(tpl, url, stats) {
  // 把根组件渲染成 HTML 字符串
  await Loadable.preloadAll();
  // console.log(1);
  await loadBranchData(url, routes);

  const context = {};
  let modules = [];
  const html = renderToString(
    <Loadable.Capture report={(moduleName) => modules.push(moduleName)}>
      <StaticRouter context={context} location={url}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Loadable.Capture>,
  );

  let bundles = getBundles(stats, modules);

  const cssList = [];
  // 将按需加载的js文件引入

  tpl = tpl.replace('<!-- script -->', function() {
    return (
      bundles
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
        .concat([`<script>window.ssrData=${JSON.stringify(dataList)};window.ssr=true;</script>`])
        .join('')
    );
  });

  // 清空请求数据
  dataList = {};
  tpl = tpl.replace('<!-- ssr -->', html);
  tpl = tpl.replace('<!-- style -->', cssList.join('\n'));

  return tpl;
}
