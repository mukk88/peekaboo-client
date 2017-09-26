import * as React from 'react';
import { Auth } from '../Login/Auth';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

interface ILoginPage {
  auth: Auth;
}

function toUploadPage() {
  window.location.assign('/upload');
}

export const Header = (props: ILoginPage) => {
  const rightIcon = props.auth.isAuthenticated() ?
    <FlatButton label="Logout" onTouchTap={() => props.auth.logout()}/> :
    undefined;

  const leftIcon = (
    <IconButton
      onClick={toUploadPage}
    >
      <FontIcon className="material-icons">backup</FontIcon>
    </IconButton> 
  );
  

  const profile = 'Peekaboo';

  return (
    <div>
      <AppBar
        title={<span>{profile}</span>}
        onTitleTouchTap={() => {window.location.assign('/'); }}
        iconElementRight={rightIcon}
        iconElementLeft={leftIcon}
      />
    </div>
  );
};