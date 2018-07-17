import React, { Component } from 'react';


export class Two extends Component {
  state = {
    data: null,
  };

  // static async queryAsyncData() {
  //   const { data } = await http.get('http://127.0.0.1:3001/test');
  //   // this.setState({
  //   //   data: data.a,
  //   // });
  //   return data;
  // }


  componentDidMount() {
    // this.get();
  }

  render() {
    return <div>twoxx,data1:{this.props.a}</div>;
  }
}

export default Two;
