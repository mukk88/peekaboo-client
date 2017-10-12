import * as React from 'react';
import { Switch, Route } from 'react-router';
import { RouteComponentProps, withRouter } from 'react-router';
import Upload from './Upload';
import Peeks from './Peeks';

class Peek extends React.Component<RouteComponentProps<{ baby: string }>, {}> {
  render() {
    return (
      <Switch>
        <Route
          path="/baby/:baby/upload"
          component={Upload}
        />
        <Route
          path="/baby/:baby"
          component={Peeks}
        />
      </Switch>
    );
  }
}

export default withRouter(Peek);