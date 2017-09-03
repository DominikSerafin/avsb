/*------------------------------------*\
  imports
\*------------------------------------*/
import axios from 'axios';



/*------------------------------------*\
  types
\*------------------------------------*/
export const SET_USER = 'SET_USER';
export const SET_EXPLORE_ITEMS = 'SET_EXPLORE_ITEMS';
export const CLEAR_EXPLORE_ITEMS = 'CLEAR_EXPLORE_ITEMS';
export const OPEN_IMG_VIEWER = 'OPEN_IMG_VIEWER';
export const CLOSE_IMG_VIEWER = 'CLOSE_IMG_VIEWER';
export const CLOSE_WELCOME = 'CLOSE_WELCOME';




/*------------------------------------*\
  sync actions
\*------------------------------------*/

export const setUser = function(data) {
  return {
    type: SET_USER,
    data: data,
  }
}

export const setExploreItems = function(data) {
  return {
    type: SET_EXPLORE_ITEMS,
    data: data,
  }
}

export const clearExploreItems = function() {
  return {
    type: CLEAR_EXPLORE_ITEMS,
  }
}

export const openImgViewer = function(data) {
  return {
    type: OPEN_IMG_VIEWER,
    data: data,
  }
}

export const closeImgViewer = function() {
  return {
    type: CLOSE_IMG_VIEWER,
  }
}

export const closeWelcome = function() {
  localStorage.setItem('welcome', JSON.stringify(false));
  return {
    type: CLOSE_WELCOME,
  }
}





/*------------------------------------*\
  async actions
\*------------------------------------*/
export const fetchExploreItems = function(){
  return function(dispatch, getState){
    var state = getState();
    axios({
      method: 'get',
      url: state.server + '/comparison/list',
    }).then(function(response){
      dispatch(setExploreItems(response.data));
    }.bind(this), function(error){
      console.error(error);
    }.bind(this));
  }
}



/*------------------------------------*\
  async actions
\*------------------------------------*/
export const fetchUser = function(){
  return function(dispatch, getState){
    var state = getState();
    axios({
      method: 'get',
      url: state.server + '/user',
    }).then(function(response){
      dispatch(setUser(response.data));
    }.bind(this), function(error){
      console.error(error);
    }.bind(this));
  }
}
