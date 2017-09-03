/*------------------------------------*\
  Imports
\*------------------------------------*/
import React from 'react';
import * as ReactRedux from 'react-redux';
import {Link} from 'react-router-dom';

import '../style/_exploreitem.scss';



/*------------------------------------*\
  Component
\*------------------------------------*/
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.constructor.displayName = 'ExploreItem';
  }
}



/*------------------------------------*\
  Functional
\*------------------------------------*/
const SvgCheckmark = () => (
  <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" version="1.1" width="48" height="48">
    <g id="surface1">
      <path d="M 22.59375 3.5 L 8.0625 18.1875 L 1.40625 11.5625 L 0 13 L 8.0625 21 L 24 4.9375 Z "/>
    </g>
  </svg>
)



/*------------------------------------*\
  Render
\*------------------------------------*/
Component.prototype.render = function(){
  return (
    <Link to={'/'+this.props.item.slug} className="exploreitem">

      <div className="exploreitem-inner">

        <div className="exploreitem-images">

          <div className="exploreitem-image">
            <img src={this.props.item.a_image} alt=""/>
          </div>

          <div className="exploreitem-image">
            {/* ref={(el) => {this.secondImage=el}} */}
            <img src={this.props.item.b_image} alt=""/>
          </div>

          { this.props.item.user_vote ? (
            <div>

              <div className="exploreitem-value mod-a">

                {this.props.item.user_vote && this.props.item.user_vote.value === 'a' ?
                 <SvgCheckmark></SvgCheckmark> : null}

                {this.props.item.a_votes} <span>{this.props.item.a_votes_percentage}%</span>
              </div>

              <div className="exploreitem-checkmark">
                {/*<SvgCheckmark></SvgCheckmark>*/}
              </div>

              <div className="exploreitem-value mod-b">

              {this.props.item.user_vote && this.props.item.user_vote.value === 'b' ? 
               <SvgCheckmark></SvgCheckmark> : null}

                {this.props.item.b_votes} <span>{this.props.item.b_votes_percentage}%</span>
              </div>

            </div>
          ) : null }

        </div>

      </div>

      {/*<div className="exploreitem-title">Which one wo daasdasdasd uld you choose?</div>*/}
    </Link>
  )
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
  mapDispatchToProps
)(Component);



/*------------------------------------*\
  Export
\*------------------------------------*/
export { Container };
