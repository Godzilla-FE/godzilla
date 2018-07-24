import React, { Component } from 'react';
import img from './img/1.png';
import d from './img/d.png';
import './one.less';
import { hot } from 'react-hot-loader';

export class One extends Component {
  render() {
    return (
      <div className="one">
        <span>12313123asdfas</span>
        <img src={img} />
      </div>
    );
  }
}

export default hot(module)(One);
