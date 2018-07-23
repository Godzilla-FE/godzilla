import React, { Component } from 'react';
import http from './tools/http';
import { hot } from 'react-hot-loader';
import Loadable from 'godzilla/dynamic';
import { renderRoutes, Link } from 'godzilla/router';
import './app.less';

export class App extends Component {
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

export default hot(module)(App);
