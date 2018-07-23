import React from 'react';
import { render, hydrate } from 'react-dom';
import App from './App';
// import { BrowserRouter } from 'react-router-dom';
import Loadable from 'godzilla/dynamic';
import Route, { renderRoutes } from 'godzilla/router';
// import { renderRoutes } from 'react-router-config';
import routes from './routes';

const Index = () => <Route>{renderRoutes(routes)}</Route>;

if (window.ssr) {
  Loadable.preloadReady().then(() => {
    hydrate(<Index />, document.querySelector('#app'));
  });
} else {
  render(<Index />, document.querySelector('#app'));
}
