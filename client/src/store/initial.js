var NODE_ENV = process.env.NODE_ENV || 'development';

var welcome = localStorage.getItem('welcome') === null ? true : JSON.parse(localStorage.getItem('welcome'));

const initialState = {
  user: null,
  server: NODE_ENV==='production' ? 'https://avsb.serafin.io/api' : 'http://localhost:9550',
  exploreItems: null,
  imgViewer: null,
  welcome: welcome,
}

export default initialState;
