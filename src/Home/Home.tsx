import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import Peek from '../Peek/Peek';

export const Home = () => {
  return (
    <Switch>
      <Route
        path="/baby/:baby"
        component={Peek}
      />
      <Route
        path="/"
        render={() => {
          return (
            <Redirect to="/baby/liv" />
          );
        }}
      />
    </Switch>
  );
};