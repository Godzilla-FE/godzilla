import React, { Component } from 'react';
import App from './App';
import Two from './routes/Two';
import One from './routes/One';

export default [
  {
    component: App,
    routes: [One, Two],
  },
];
