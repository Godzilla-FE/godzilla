import React, { Component } from 'react';
import App from './App';
import Two from './routes/Two';
import One from './routes/One';
import { warpRoutes } from 'godzilla/router';

export default warpRoutes([
  {
    component: App,
    routes: [One, Two],
  },
]);
