/*------------------------------------*\
  Imports
\*------------------------------------*/
import React from 'react';
import * as ReactRedux from 'react-redux';
import {Switch, BrowserRouter as Router, Route} from 'react-router-dom';
import * as actions from './store/actions.js';
import objectFitImages from 'object-fit-images';
import detectBrowser from './script/detect-browser.js';

import {Container as TopBar} from './views/TopBar.jsx';
import {Container as ImgViewer} from './views/ImgViewer.jsx';
import {Container as Welcome} from './views/Welcome.jsx';

import {Container as Explore} from './views/Explore.jsx';
import {Container as Comparison} from './views/Comparison.jsx';
import {Container as ComparisonNew} from './views/ComparisonNew.jsx';
import {Container as Error404} from './views/Error404.jsx';

import './style/nsanitize.scss';
import './style/defaults.scss';
import './style/scrollbar.scss';
import './style/_app.scss';
import './resources/font/cotham/web-hinted/stylesheet.css';





/*------------------------------------*\
  Component
\*------------------------------------*/
class AppComponent extends React.Component {

  componentWillMount(){
  }

  componentDidMount() {
    this.addBodyBrowserClass();
    this.props.fetchUser();
    objectFitImages();
  }

  componentWillUpdate (nextProps, nextState) {
    this.bodyOverflowHandler(nextProps);
  }

  bodyOverflowHandler(nextProps){
    if (nextProps.state.imgViewer || nextProps.state.welcome) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  addBodyBrowserClass(){
    var className = '';
    var detect = detectBrowser();
    for (var b in detect) {
      detect[b] ? className += (' mod-browser-'+b+' ') : null;
    }
    document.body.className += className;
  }

  render () {
    return (
      <Router>
        <div className="app-root">

          <TopBar></TopBar>

          <div className="app-page">
            <Switch>
              {/*  <Route exact path="/" render={() => (<Redirect to="/comparison/"/>)}/>*/}
              <Route exact path="/" component={Comparison}/>
              <Route path="/new" component={ComparisonNew}/>
              <Route path="/explore" component={Explore}/>
              <Route path="/not-found" component={Error404}/>
              <Route path="/:slug" component={Comparison}/>
              <Route component={Error404}/>
            </Switch>
          </div>

          <ImgViewer></ImgViewer>

          <Welcome></Welcome>

          <div className="app-footer">
            <a target="_blank" rel="noopener noreferrer" href="//serafin.io">Tool created by Dominik Serafin. </a>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/DominikSerafin/avsb">Contribute on GitHub.</a>
          </div>

        </div>
      </Router>
    );
  }

}



/*------------------------------------*\
  Redux
\*------------------------------------*/
const mapStateToProps = function(state, ownProps) {
  return {
    state: state,
  }
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    fetchUser: function() {
      dispatch( actions.fetchUser() );
    }
  }
}

const App = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);


/*------------------------------------*\
  Export
\*------------------------------------*/
export default App;
