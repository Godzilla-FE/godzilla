import React, { Component } from 'react';
import http from './tools/http';
import Loadable from 'godzilla/dynamic';
import { renderRoutes, Link } from 'godzilla/router';
import './app.less';

export default class App extends Component {
  static queryAsyncData = async () => {
    const { data } = await http.get('/test');
    // this.setState({
    //   data: data.a,
    // });
    return data;
  };

  // componentDidMount() {
  //   this.get();
  // }

  render() {
    return (
      <div>
        data:{this.props.a}
        {renderRoutes(this.props.route.routes)}
        <Link to="/one">去one4</Link>
        <Link to="/two">去two1</Link>
      </div>
    );
  }
}

