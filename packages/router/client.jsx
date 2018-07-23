import React, { Component } from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from './index';
import { BrowserRouter } from 'react-router-dom';

export default class ClientRouter extends Component {
  render() {
    const data = window._godzillaData || {};
    data.remove = (id) => {
      data[id] = undefined;
    };
    return (
      <Provider value={data}>
        <BrowserRouter>{this.props.children}</BrowserRouter>
      </Provider>
    );
  }
}
