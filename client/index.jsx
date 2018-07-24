import React from 'react';
import { render, hydrate } from 'react-dom';
import Loadable from 'godzilla/dynamic';
import Client from './client';

if (window.ssr) {
  Loadable.preloadReady().then(() => {
    hydrate(<Client />, document.querySelector('#app'));
  });
} else {
  render(<Client />, document.querySelector('#app'));
}
