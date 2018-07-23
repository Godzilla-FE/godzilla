import React, { Component } from 'react';
import reactLoadable from 'react-loadable';

function Dynamic(opts) {
  const LoadableComponent = reactLoadable(opts);
  LoadableComponent.queryAsyncData = async () => {
    const { default: component } = await opts.loader();
    if (component.queryAsyncData) {
      const data = await component.queryAsyncData();
      return data;
    }
    return {};
  };
  return LoadableComponent;
}
Dynamic.preloadAll = reactLoadable.preloadAll;
Dynamic.preloadReady = reactLoadable.preloadReady;
Dynamic.Capture = reactLoadable.Capture;

export default Dynamic;
