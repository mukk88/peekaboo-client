import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
