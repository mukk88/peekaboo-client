import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Peeks } from '../Peek/Peeks';
import Peek from '../Peek/Peek';
import { Upload } from '../Peek/Upload';

export const Home = () => {
  return (
    <Switch>
      <Route
        path="/peek/:id"
        component={Peek}
      />
      <Route
        path="/upload"
        component={Upload}
      />
      <Route
        path="/"
        component={Peeks}
      />
    </Switch>
  );
};