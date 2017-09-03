import * as Redux from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers.js';
import initialState from './initial.js';

const composeEnhancers = (
  typeof window === 'object' && (
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :
    Redux.compose
  )
);

const enhancers = composeEnhancers(
  Redux.applyMiddleware(thunk),
);

var store = Redux.createStore(
  rootReducer,
  initialState,
  enhancers,
);

export default store;
