import * as React from 'react';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { Auth } from './Auth';
import Paper from 'material-ui/Paper';

const paperStyles: React.CSSProperties = {
  position: 'fixed',
  padding: '3em 2em',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const signInStyle: React.CSSProperties = {
  fontSize: '1.5em',
};

const loginButtonStyle: React.CSSProperties = {
  float: 'right',
};

const cardStyles: React.CSSProperties = {
  boxShadow: 'none'
};

export function Login(props: { auth: Auth }) {

  return (
    <Paper zDepth={2} style={paperStyles}>
      <Card expanded={true} style={cardStyles}>
          <CardHeader
            title="Peekaboo"
            subtitle="Liv"
          />
          <CardText>
            <div style={signInStyle}>
              Sign in
            </div>
            <div>
              to view photos
            </div>
          </CardText>
          <CardActions>
            <RaisedButton style={loginButtonStyle} label="Login" primary={true} onTouchTap={props.auth.login}/>
          </CardActions>
        </Card>
    </Paper>
  );
}