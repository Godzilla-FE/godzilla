import React, { Component } from 'react';
import http from 'axios';
export class Two extends Component {
  state = {
    data: null,
  };

  static async queryAsyncData() {
    const { data } = await http.get('/test');
    // this.setState({
    //   data: data.a,
    // });
    return data;
  }

  componentDidMount() {
    // this.get();
  }

  render() {
    return <div>twoxx,data1:{this.props.a}</div>;
  }
}

export default Two;