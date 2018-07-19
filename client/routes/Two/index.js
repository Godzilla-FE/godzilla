import React from 'react';
import Loadable from 'godzilla/Dynamic';
const Two = Loadable({
  loader: () => import('./Two'),
  loading() {
    return <div>Loading...</div>;
  },
});

Two.queryAsyncData = async () => {
  const { default: component } = await import('./Two');
  if (component.queryAsyncData) {
    const data = await component.queryAsyncData();
    return data;
  }
  return {};
};

export default {
  path: '/two',
  component: Two,
  exact: true,
};
