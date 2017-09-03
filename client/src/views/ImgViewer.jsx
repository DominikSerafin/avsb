/*------------------------------------*\
  Imports
\*------------------------------------*/
import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from '../store/actions.js';

import '../style/_imgviewer.scss';



/*------------------------------------*\
  Component
\*------------------------------------*/
class Component extends React.Component {

  constructor(props) {
    super(props);
    this.constructor.displayName = 'ImgViewer';
    this.closeImgViewer = this.closeImgViewer.bind(this);
  }

  closeImgViewer() {
    this.props.closeImgViewer();
  }

}



/*------------------------------------*\
  Render
\*------------------------------------*/
Component.prototype.render = function() {
  return this.props.state.imgViewer ? (
    <div className="imgviewer" onClick={this.closeImgViewer.bind(this)}>
      <div className="imgviewer-backdrop"></div>
      <div className="imgviewer-content mod-scrollbar-avsb">
        {/*<button className="imgviewer-close" type="button" onClick={this.closeImgViewer.bind(this)}>Close</button>*/}
        <div className="imgviewer-content-inner">
          <img src={this.props.state.imgViewer} alt=""/>
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
    closeImgViewer: function() {
      dispatch( actions.closeImgViewer() );
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
