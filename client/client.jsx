import React, { Component } from 'react';
import routes from './routes';
import Route, { renderRoutes } from 'godzilla/router';
import { hot } from 'react-hot-loader';

export class Client extends Component {
  render() {
    return <Route>{renderRoutes(routes)}</Route>;
  }
}

export default hot(module)(Client);
