import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {isAuthenticated} from '../services/api';
import Home from '../pages/Home';

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{pathname: '/', state: {from: props.location}}} />
      )
    }
  />
);

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path='/' render={(props) => <Home {...props} />} />
        <Route path='*' component={() => <h1>Page not found</h1>} />
      </Switch>
    </BrowserRouter>
  );
}
