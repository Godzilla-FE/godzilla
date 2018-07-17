import React, { Component } from 'react';
import App from './App';
import One from './One';
import Two from './routes/Two';

export default [
  {
    component: App,
    routes: [
      {
        path: '/one',
        exact: true,
        component: One,
      },
      Two,
    ],
  },
];
