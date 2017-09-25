import { 
  WebAuth,
  Auth0DecodedHash,
} from 'auth0-js';

const envAuthSettings = {
  production: {
    domain: 'hanabi.auth0.com',
    clientID: 'sC0ScOO1QVjNu3BTyPjvZeYAPjHgFrQT',
    redirectUri: 'http://peekaboo.markwooym.com/callback',
    audience: 'https://hanabi.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile'
  },
  development: {
    domain: 'hanabi.auth0.com',
    clientID: 'sC0ScOO1QVjNu3BTyPjvZeYAPjHgFrQT',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://hanabi.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile'
  }
};

export class Auth {
  // tslint:disable-next-line
  authSettings = envAuthSettings[(process as any).env.NODE_ENV];
  auth0 = new WebAuth(this.authSettings);

  login = () => {
    this.auth0.authorize(this.authSettings);
  }

  logout() {
    localStorage.removeItem('profile');
    window.location.assign('/home'); 
  }

  setSession = (authResult: Auth0DecodedHash) => {

    if (authResult && authResult.accessToken && authResult.idToken) {
      // Set the time that the access token will expire at
      const expiresAt = JSON.stringify(((authResult.expiresIn || 0) * 1000) + new Date().getTime());

      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('idToken', authResult.idToken);
      localStorage.setItem('expiresAt', expiresAt);
    }

    // this.auth0.client.userInfo(accessToken, (err, profile) => {
    //   console.log(err);
    //   if (profile && profile.name) {
    //     localStorage.setItem('profile', profile.name);
    //     localStorage.setItem()
    //   }
    //   window.location.assign('/home'); 
    // });
  }

  handleAuthentication = () => {

    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        window.location.assign('/home');
      } else if (err) {
        window.location.assign('/home');
      }
    });

    // const re = /access_token=[^&]*/;
    // const matches = window.location.hash.match(re);
    
    // if (matches) {
    //   this.setSession(matches[0].split('=')[1]);
    // } else {
    //   window.location.assign('/home');
    // }
  }

  isAuthenticated = () => {
    return true;
    // if (!localStorage.getItem('accessToken')) {
    //   return false;
    // }
    // const expiresAt = localStorage.getItem('expiresAt');
    // return new Date().getTime() < parseInt(expiresAt || '0', 10);
  }

  getProfile = () => {
    return (localStorage.getItem('profile') || 'Unknown').substring(0, 15);
  }

}
