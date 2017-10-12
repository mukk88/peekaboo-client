import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import IconMenu from 'material-ui/IconMenu';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { Auth } from '../Login/Auth';

interface ILoginPage {
  auth: Auth;
  // tslint:disable-next-line
  routerProps: RouteComponentProps<any>;
}

export const Header = (props: ILoginPage) => {

  const toUploadPage = () => {
    window.location.assign(`/baby/${props.routerProps.match.params.baby}/upload`);
  };

  // const rightIcon = props.auth.isAuthenticated() ?
  //   <FlatButton label="Logout" onTouchTap={() => props.auth.logout()}/> :
  //   undefined;

  const leftIcon = (
    <IconMenu
      iconButtonElement={
        <IconButton><MoreVertIcon /></IconButton>
      }
      targetOrigin={{horizontal: 'right', vertical: 'top'}}
      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
      <MenuItem primaryText="Liv" onTouchTap={() => { window.location.assign('/baby/liv'); }}/>
      <MenuItem primaryText="Lexie" onTouchTap={() => { window.location.assign('/baby/lexie'); }}/>
    </IconMenu>
  );

  const rightIcon = (
    <IconButton
      onClick={toUploadPage}
    >
      <FontIcon className="material-icons">backup</FontIcon>
    </IconButton> 
  );
  
  const profile = props.routerProps.match.params.baby;

  return (
    <div>
      <AppBar
        title={<span>{profile}</span>}
        onTitleTouchTap={() => {window.location.assign(`/baby/${props.routerProps.match.params.baby}`); }}
        iconElementRight={rightIcon}
        iconElementLeft={leftIcon}
      />
    </div>
  );
};