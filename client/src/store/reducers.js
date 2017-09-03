
// imports
import * as Redux from 'redux';
import assign from 'lodash/assign';

// actions
import * as actions from './actions.js';


// state
var general = function(state={}, action) {

  switch (action.type) {

    case actions.SET_EXPLORE_ITEMS:
      return assign({}, state, { exploreItems: action.data });

    case actions.CLEAR_EXPLORE_ITEMS:
      return assign({}, state, { exploreItems: null });

    case actions.SET_USER:
      return assign({}, state, { user: action.data });

    case actions.OPEN_IMG_VIEWER:
      return assign({}, state, { imgViewer: action.data });

    case actions.CLOSE_IMG_VIEWER:
      return assign({}, state, { imgViewer: null });

    case actions.CLOSE_WELCOME:
      return assign({}, state, { welcome: null });

    default:
      return state;

  }

}


var rootReducer = general;
export default rootReducer;

// combined
/*
var rootReducer = Redux.combineReducers({
  general: general,
});


export default rootReducer;

*/
