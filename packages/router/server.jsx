import React, { Component } from 'react';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import { Provider } from './index';

export default class ServerRouter extends Component {
  render() {
    const { context, location, basename, data } = this.props;
    
    return (
      <Provider value={data}>
        <StaticRouter context={context} location={location} basename={basename}>
          {this.props.children}
        </StaticRouter>
      </Provider>
    );
  }
}

export function loadRouteData(url, routes) {
  const branch = matchRoutes(routes, url);
  const promises = branch.map(({ route, match }) => {
    return route.queryAsyncData
      ? route.queryAsyncData(match).then((data) => {
          return {
            id: route.dataId,
            data,
          };
        })
      : Promise.resolve(null);
  });

  return Promise.all(promises).then((dataList) => {
    const ret = {};
    for (let item of dataList) {
      ret[item.id] = item.data;
    }
    return ret;
  });
}
