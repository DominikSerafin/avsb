/*------------------------------------*\
  Imports
\*------------------------------------*/
import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from '../store/actions.js';

import '../style/_welcome.scss';



/*------------------------------------*\
  Component
\*------------------------------------*/
class Component extends React.Component {

  constructor(props) {
    super(props);
    this.constructor.displayName = 'Welcome';
  }

  closeWelcome() {
    this.props.closeWelcome();
  }

}



/*------------------------------------*\
  Render
\*------------------------------------*/
Component.prototype.render = function() {
  return this.props.state.welcome ? (
    <div className="welcome">
      <div className="welcome-backdrop"></div>
      <div className="welcome-content mod-scrollbar-avsb">

        <div className="welcome-content-inner">

          <h1>Hello to AvsB!</h1>

          <p>
            AvsB is a little tool created to vote between two images. You can use it to get feedback for your latest drawing/mockup/photo/UI/whatever.
            {/*<br/> (In reality people will probably use it to upload memes...)*/}
          </p>

          <h2>How it Works</h2>

          <ul>
            <li>🎎 Single post (aka Comparison) consists of two images.</li>
            <li>🎯 You can vote only one time for each Comparison.</li>
            <li>🏆 You can add your own Comparison for each 10 votes given.</li>
            <li>👀 You can see score of Comparison after you&apos;ve voted on it.</li>
            <li>🙅 No sign up required. It uses magic to save your votes.</li>
          </ul>

          <h2>It&apos;s Open Source</h2>

          <p>You can contribute to server and client code on <a target="_blank" href="https://github.com/DominikSerafin/avsb">GitHub</a>.</p>

          <button className="welcome-text-close" type="button" onClick={this.closeWelcome.bind(this)}>
            Neato. Let me in.
          </button>

        </div>
      </div>
    </div>
  ) : null;
};



/*------------------------------------*\
  redux
\*------------------------------------*/
const mapStateToProps = function(state, ownProps) {
  return { state: state }
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    closeWelcome: function() {
      dispatch( actions.closeWelcome() );
    }
  }
}

const Container = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Component);



/*------------------------------------*\
  Export
\*------------------------------------*/
export { Container };
