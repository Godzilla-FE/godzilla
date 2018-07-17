import React, { Component } from 'react';
import reactLoadable from 'react-loadable';

export default function Loadable(opts) {
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
