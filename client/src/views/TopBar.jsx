/*------------------------------------*\
  Imports
\*------------------------------------*/
import React from 'react';
import * as ReactRedux from 'react-redux';
import { NavLink } from 'react-router-dom';

import '../style/_topbar.scss';



/*------------------------------------*\
  Component
\*------------------------------------*/
class Component extends React.Component {

  constructor(props) {
    super(props);
    this.constructor.displayName = 'TopBar';
  }

  headerIsActive(match, location) {
    if (location.pathname==='/explore' || location.pathname==='/new') {
      return false;
    }
    return true;
  }

}



/*------------------------------------*\
  Render
\*------------------------------------*/
Component.prototype.render = function() {
  return (
    <div className="topbar">
      <div className="topbar-inner">

        <NavLink className="topbar-navel mod-left" to="/explore" exact>Explore</NavLink>

        <NavLink className="topbar-header" to="/" exact isActive={this.headerIsActive}>A<span>vs</span>B</NavLink>

        <NavLink className="topbar-navel mod-right" to="/new" exact>
          New {this.props.state.user && this.props.state.user.available_comparisons ?
            <span title="Amount of available Comparisons that can be created by you (10 votes = 1 Comparison)">
              &bull; {this.props.state.user.available_comparisons}
            </span> : null}
        </NavLink>

      </div>
    </div>
  );
};



/*------------------------------------*\
  Redux
\*------------------------------------*/
const mapStateToProps = function(state, ownProps) {
  return { state: state }
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {}
}

const Container = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false } // fix for NavLink active classes
)(Component);



/*------------------------------------*\
  Export
\*------------------------------------*/
export { Container };
