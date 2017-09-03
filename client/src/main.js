/*------------------------------------*\
  Imports
\*------------------------------------*/

// polyfills (cherry-pick instead importing heavy babel-polyfill)
//import 'babel-polyfill';
import 'regenerator-runtime/runtime';
import 'core-js/fn/promise';
import 'core-js/fn/array/from';
import 'core-js/fn/array/includes';
import 'core-js/fn/object/assign';

// react & redux
import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';

// app component
import App from './App.jsx';

// store
import store from './store/store.js';



/*------------------------------------*\
  Root
\*------------------------------------*/
var AppElement = React.createElement(App);
var ProviderElement = React.createElement(
  ReactRedux.Provider,
  { store: store },
  AppElement
);



/*------------------------------------*\
  Render
\*------------------------------------*/
ReactDOM.render(
  ProviderElement,
  document.getElementById('app')
);
