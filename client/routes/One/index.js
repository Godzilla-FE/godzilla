import React from 'react';
// import One from './One';
import Loadable from 'godzilla/dynamic';
const One = Loadable({
  loader: () => import('./One'),
  loading() {
    return <div>Loading...</div>;
  },
});

export default {
  path: '/one',
  component: One,
  exact: true,
};
