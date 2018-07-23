import React, { Component } from 'react';
export { renderRoutes, matchRoutes } from 'react-router-config';
export { Link } from 'react-router-dom';

const { Provider, Consumer } = React.createContext();
export { Provider, Consumer };
import client from './client';
export default client;
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// TODO: id可以尝试用babel编译出来
let id = 0;
export function warpRoutes(routes) {
  for (const route of routes) {
    route.dataId = 'godz_' + id++;
    route.queryAsyncData = route.component.queryAsyncData;
    const Com = warpAsyncData(route.component, route.dataId);

    route.component = (props) => (
      <Consumer>
        {(data) => {
          return <Com {...props} godzData={data} />;
        }}
      </Consumer>
    );
    if (route.routes && route.routes.length >= 1) {
      route.routes = warpRoutes(route.routes);
    }
  }
  return routes;
}

function warpAsyncData(WrappedComponent, dataId) {
  return class Warp extends Component {
    static displayName = `warpGodzillaRoute${getDisplayName(WrappedComponent)}`;

    state = {
      data: this.props.godzData[dataId] || {},
    };
    constructor(props) {
      super(props);
      if (this.props.godzData[dataId] && this.props.godzData.remove) {
        // 删除保存的数据，这样路由切换可以请求新的数据而不是旧的脏数据
        // 只有客户端才会删除
        this.props.godzData.remove(this.props.godzData[dataId]);
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
