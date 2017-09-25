import * as React from 'react';
import { Auth } from '../Login/Auth';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

interface ILoginPage {
  auth: Auth;
}

export const Header = (props: ILoginPage) => {
  const rightIcon = props.auth.isAuthenticated() ?
    <FlatButton label="Logout" onTouchTap={() => props.auth.logout()}/> :
    undefined;

  const profile = props.auth.getProfile();

  return (
    <div>
      <AppBar
        title={<span>{profile}</span>}
        onTitleTouchTap={() => {window.location.assign('/'); }}
        iconElementRight={rightIcon}
      />
    </div>
  );
};