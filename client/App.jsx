import React, { Component } from 'react';
import http from 'axios';
import { Route, Switch, Link } from 'react-router-dom';
import One from './One';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { renderRoutes } from 'react-router-config';

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
        {/* <Switch>
          <Route path="/one" component={One} />
          <Route path="/two" component={Two} />
        </Switch>*/}
        {renderRoutes(this.props.route.routes)}
        <Link to="/one">去one4</Link>
        <Link to="/two">去two1</Link>
      </div>
    );
  }
}

export default hot(module)(App);
