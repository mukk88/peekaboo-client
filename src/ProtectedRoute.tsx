import * as React from 'react';
import { Auth } from './Login/Auth';
import { 
  Redirect,
  RedirectProps,
  Route,
  RouteProps
} from 'react-router';

interface IRedirect {
  redirect?: RedirectProps;
  auth: Auth;
}

interface IProtectedState {
  signedIn: boolean;
}

type IProtectedProps = RouteProps & IRedirect;

export class ProtectedRoute extends React.Component<IProtectedProps, IProtectedState> {
    
  constructor(props: IProtectedProps) {
    super(props);
    const signedIn = props.auth.isAuthenticated();
    this.state = {
      signedIn,
    };
  }

  render() {
    const defaultRedirect = {
      to: '/login',
      from: this.props.location && this.props.location.pathname
    };
    const redirect = {...defaultRedirect, ...this.props.redirect};
    return this.state.signedIn ?
      <Route {...this.props}/> :
      <Redirect {...redirect}/>;
  }
}