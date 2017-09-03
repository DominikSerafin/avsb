/*------------------------------------*\
  Imports
\*------------------------------------*/
import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from '../store/actions.js';

import {Container as ExploreItem} from '../views/ExploreItem.jsx';

import Spinner from '../views/Spinner.jsx';

import '../style/_explore.scss';



/*------------------------------------*\
  Component
\*------------------------------------*/
class Component extends React.Component {

  constructor(props) {
    super(props);
    this.constructor.displayName = 'Explore';
  }

  componentDidMount(){
    this.props.clearExploreItems();
    this.props.fetchExploreItems();
  }

}



/*------------------------------------*\
  Functional
\*------------------------------------*/
const AllExploreItems = (props) => (
  <div>
    {props.items.map(function(item, i){
      return <ExploreItem item={item} key={i} />;
    })}
  </div>
)



/*------------------------------------*\
  Render
\*------------------------------------*/
Component.prototype.render = function() {

  if (!this.props.state.exploreItems) {
    return (
      <div className="explore-spinner"><Spinner></Spinner></div>
    )
  }

  if (this.props.state.exploreItems) {
    return (
      <div className="explore">
        <div className="explore-inner">

          <AllExploreItems items={this.props.state.exploreItems}></AllExploreItems>

        </div>
      </div>
    )
  }

}



/*------------------------------------*\
  Redux
\*------------------------------------*/
const mapStateToProps = function(state, ownProps) {
  return { state: state }
}

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    openImgViewer: function(url) {
      dispatch( actions.openImgViewer(url) );
    },
    fetchExploreItems: function() {
      dispatch( actions.fetchExploreItems() );
    },
    clearExploreItems: function() {
      dispatch( actions.clearExploreItems() );
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
