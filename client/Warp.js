import React, { Component } from 'react';
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
const ssrData = window.ssrData || {};

function warpAsyncData(WrappedComponent, dataId) {
  return class Warp extends Component {
    static displayName = `warpGodzillaRoute${getDisplayName(WrappedComponent)}`;
    state = {
      data: ssrData[dataId] || {},
    };
    constructor(props) {
      super(props);
      if (ssrData[dataId]) {
        // 删除保存的数据，这样路由切换可以请求新的数据而不是旧的脏数据
        delete ssrData[dataId];
      } else {
        this.query();
      }
    }
    query = async () => {
      if (!WrappedComponent.queryAsyncData) return;
      const data = await WrappedComponent.queryAsyncData();
      this.setState({
        data,
      });
    };

    render() {
      return <WrappedComponent {...this.props} {...this.state.data} />;
    }
  };
}
let id = 0;
export default function warpRoute(routes) {
  for (const route of routes) {
    route.dataId = id++;
    route.component = warpAsyncData(route.component, route.dataId);
    if (route.routes && route.routes.length >= 1) {
      route.routes = warpRoute(route.routes);
    }
  }
  return routes;
}
