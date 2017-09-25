import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

class Peek extends React.Component<RouteComponentProps<{ id: string }>, {}> {
  render() {
    return (
      <div>a</div>
    );
  }
}

export default withRouter(Peek);