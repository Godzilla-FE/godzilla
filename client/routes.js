import React, { Component } from 'react';
import App from './App';
import One from './One';
import Loadable from 'react-loadable';
import http from 'axios';

const Two = Loadable({
  loader: () => import('./Two'),
  loading() {
    return <div>Loading...</div>;
  },
});

Two.queryAsyncData = async () => {
  const { data } = await http.get('http://127.0.0.1:3001/test');
  // this.setState({
  //   data: data.a,
  // });
  return data;
};

export default [
  {
    component: App,
    routes: [
      {
        path: '/one',
        exact: true,
        component: One,
      },
      {
        path: '/two',
        exact: true,
        component: Two,
      },
    ],
  },
];
