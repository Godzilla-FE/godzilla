import React, { Component } from 'react';
import img from './img/1.png';
import d from './img/d.png';
import './one.less'

export class One extends Component {
  render() {
    return (
      <div className="one">
        1111one
        <img src={img} />
      </div>
    );
  }
}

export default One;
