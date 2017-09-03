/*------------------------------------*\
  Imports
\*------------------------------------*/
import React from 'react';
import * as ReactRedux from 'react-redux';

import '../style/_error.scss';



/*------------------------------------*\
  Component
\*------------------------------------*/
class Component extends React.Component {

  constructor(props) {
    super(props);
    this.constructor.displayName = 'Error404';
  }

}



/*------------------------------------*\
  Render
\*------------------------------------*/
Component.prototype.render = function() {
  return (
    <div className="error">
      <div className="error-inner">

        Big Fat 404

      </div>
    </div>
  );
}



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
