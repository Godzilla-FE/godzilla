import React from 'react';
import Loadable from 'godzilla/dynamic';
const Two = Loadable({
  loader: () => import(/* webpackChunkName: "Two" */'./Two'),
  loading() {
    return <div>Loading...</div>;
  },
});

export default {
  path: '/two',
  component: Two,
  exact: true,
};
