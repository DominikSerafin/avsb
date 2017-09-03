/*------------------------------------*\
  Imports
\*------------------------------------*/
import React from 'react';
import * as ReactRedux from 'react-redux';
import * as actions from '../store/actions.js';
import axios from 'axios';

import Spinner from '../views/Spinner.jsx';

import '../style/_comparison.scss';



/*------------------------------------*\
  Component
\*------------------------------------*/
class Component extends React.Component {

  initialState(){
    return {
      comparison: null,
      voted: false,
      showNextOneButton: false,
      votedOnEverything: false,
    }
  }

  constructor(props) {
    super(props);
    this.constructor.displayName = 'Comparison';
    this.state = this.initialState();
    this.enlargeImage = this.enlargeImage.bind(this);
    this.vote = this.vote.bind(this);
    this.nextOneHandler = this.nextOneHandler.bind(this);
  }

  componentDidMount(){
    this.props.match.path==='/' ? this.getNextComparison() : this.getComparison();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.path != this.props.match.path && this.props.match.path === '/') {
      this.getNextComparison();
    } else if (this.props.match.params.slug != prevProps.match.params.slug) {
      this.getComparison()
    }
  }

  enlargeImage(aorb){
    if (!aorb) { alert('no enlargeImage aorb'); return; }
    if (!this.state.comparison[aorb+'_image']) { alert('no enlargeImage comparison aorb'); return; }
    this.props.openImgViewer(this.state.comparison[aorb+'_image']);
  }

  vote(aorb){

    if (this.state.voted) { return; }
    if (!aorb) { alert('no choose aorb'); return; }
    if (!this.state.comparison[aorb+'_image']) { alert('no choose comparison aorb'); return; }

    var slug = this.state.comparison.slug;

    axios({
      method: 'post',
      url: `${this.props.state.server}/${slug}/vote/${aorb}`,
    }).then(function(response){

      // update only votes
      var comparison = this.state.comparison;
      comparison.a_votes = response.data.a_votes;
      comparison.a_votes_percentage = response.data.a_votes_percentage;
      comparison.b_votes = response.data.b_votes;
      comparison.b_votes_percentage = response.data.b_votes_percentage;

      this.setState({
        comparison: comparison,
        voted: aorb,
        showNextOneButton: true,
      });

      this.props.fetchUser();

    }.bind(this), function(error){
      //console.error(error);
    }.bind(this));

  }

  getNextComparison(){

    axios({
      method: 'get',
      url: `${this.props.state.server}/comparison/queue`,
    }).then(function(response){
      if (parseInt(response.data)===0) {
        this.setState({
          comparison: null,
          voted: false,
          showNextOneButton: false,
          votedOnEverything: true,
        })
      } else {
        this.props.history.replace('/'+response.data);
      }
    }.bind(this), function(error){
      this.props.history.push('/not-found');
    }.bind(this));

  }

  getComparison(){

    var slug = this.props.match.params.slug;

    this.cleanComparison();

    // REGEX!
    if (!slug  /*|| regex(slug)*/ ) {
      this.props.history.push('/not-found');
      return;
    }

    axios({
      method: 'get',
      url: `${this.props.state.server}/${slug}`,
    }).then(function(response){

      this.setState({
        comparison: response.data,
        voted: response.data.user_vote ? response.data.user_vote.value : false,
      });

    }.bind(this), function(error){
      this.props.history.push('/not-found');
    }.bind(this));

  }

  cleanComparison(){
    this.setState({
      comparison: null,
      voted: false,
      showNextOneButton: false,
    });
  }

  nextOneHandler(){
    this.getNextComparison();
  }

  /*
  reply() {

    var replies = [
      `Hmmm... Interesting.`,
      `Hmmm... Interesting.`,
      `Hmmm... Interesting.`,
      `I hope you picked the right thing...`,
      `That's disturbing!`,
      `That's disturbing!`,
      `That's disturbing!`,
      `Does it matter anyway?`,
      `There are no take backs.`,
      `There are no take backs.`,
      `There are no take backs.`,
      `Are you sure you're spending your time productively?`,
      `It might've been good decision. Or not.`,
      `Wow!`,
      `Wow Wow Wow!!!`,
      `Oh Yeah!`,
      `Another one.`,
      `Another one.`,
      //`I'm reporting you to the authorities.`,
      `Let's hope next one will be more interesting...`,
      `Next one might've been added by Tom Cruise. Who knows...`,
      `Next one might've been added by Obama. You never know...`,
      `Next one might've been added by Taylor Swift. You never know...`,
      `That's cool.`,
      `(╯°□°）╯︵ ┻━┻`,
      `(╯°□°）╯︵ ┻━┻`,
      `¯\_(ツ)_/¯`,
      `¯\_(ツ)_/¯`,
      `¯\_(ツ)_/¯`,
      `¯\_(ツ)_/¯`,
      `¯\_(ツ)_/¯`,
      `̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\З= ( ▀ ͜͞ʖ▀) =Ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿`,
      `̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\З= ( ▀ ͜͞ʖ▀) =Ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿`,
      `(ᵔᴥᵔ)`,
      `(ᵔᴥᵔ)`,
      `(/) (°,,°) (/)  Why not Zoidberg? `,
      `(/) (°,,°) (/)  Why not Zoidberg? `,
    ];
    var i = Math.floor(Math.random()*replies.length);
    return replies[i];

  }
  */

}



/*------------------------------------*\
  Functional
\*------------------------------------*/
const SvgZoomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" version="1.1" width="64" height="64">
    <g id="surface1">
      <path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z "/>
    </g>
  </svg>
)

const SvgCheckmark = () => (
  <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" version="1.1" width="48" height="48">
    <g id="surface1">
      <path d="M 22.59375 3.5 L 8.0625 18.1875 L 1.40625 11.5625 L 0 13 L 8.0625 21 L 24 4.9375 Z "/>
    </g>
  </svg>
)

const SpinnerWrapper = () => (
  <div className="comparison-spinner"><Spinner></Spinner></div>
)

const Votes = (props) => (
  <div className="comparison-votes">
    <div>
      <div className="title">{/*props.voted ? '(+You)' : ''*/} Votes</div>
      <div>
        <span className="value">{props.votes ? props.votes : '0' }</span>
        <span className="percentage">{props.percentage ? props.percentage : '0'}%</span>
      </div>
    </div>
  </div>
)

const TheEnd = (props) => (
  <div className="comparison-end">
    <div>
      Congrats! You&apos;ve voted on everything.
    </div>
  </div>
)



/*------------------------------------*\
  Render
\*------------------------------------*/
Component.prototype.render = function() {

  /*
  if (this.state.voted) {
    return (<div className="comparison-voted">
      <div className="comparison-voted-text">
        {this.reply()}
      </div>
      <div className="comparison-voted-next-wrapper">
        <button className="comparison-next" type="button" onClick={this.nextOneHandler}>Next One</button>
      </div>
    </div>)
  }
  */

  if (this.state.votedOnEverything) {
    return <TheEnd></TheEnd>
  }

  if (!this.state.votedOnEverything && !this.state.comparison) {
    return <SpinnerWrapper></SpinnerWrapper>
  }

  if (!this.state.votedOnEverything && this.state.comparison) {

    return (
      <div className="comparison">
        <div className="comparison-inner">

          <h2 className="comparison-title">{this.state.comparison.title ? this.state.comparison.title : 'Which one do you prefer?'}</h2>

          {this.state.voted && this.state.showNextOneButton ?
            <div className="comparison-voted-next-wrapper">
              <button className="comparison-next" type="button" onClick={this.nextOneHandler}>Next</button>
            </div> : null }

          <div className="comparison-items">


            {/* item */}
            <div className="comparison-item">

              <div className="comparison-image">

                <img src={this.state.comparison.a_image} alt=""/>

                {!this.state.voted ?
                  <button type="button" className="comparison-choose" onClick={this.vote.bind(this, 'a')}>
                    <SvgCheckmark></SvgCheckmark>
                  </button> :
                  <Votes votes={this.state.comparison.a_votes} voted={this.state.voted==='a'}
                    percentage={this.state.comparison.a_votes_percentage}>
                  </Votes>
                }

                {this.state.voted && this.state.voted === 'a' ?
                  <div className="comparison-voted-checkmark">
                    <SvgCheckmark></SvgCheckmark>
                  </div> : null }

              </div>

              <button type="button" className="comparison-image-enlarge" onClick={this.enlargeImage.bind(this, 'a')}>
                <SvgZoomIcon></SvgZoomIcon>
              </button>

              <div className="comparison-desc">&nbsp;{this.state.comparison.a_description}&nbsp;</div>


            </div>

            {/* between
            <div className="comparison-between">or</div>*/}


            {/* item */}
            <div className="comparison-item">

              <div className="comparison-image">

                <img src={this.state.comparison.b_image} alt=""/>

                {!this.state.voted ?
                  <button type="button" className="comparison-choose" onClick={this.vote.bind(this, 'b')}>
                    <SvgCheckmark></SvgCheckmark>
                  </button> :
                  <Votes votes={this.state.comparison.b_votes} voted={this.state.voted==='b'}
                    percentage={this.state.comparison.b_votes_percentage}>
                  </Votes>
                }

                {this.state.voted && this.state.voted === 'b' ?
                  <div className="comparison-voted-checkmark">
                    <SvgCheckmark></SvgCheckmark>
                  </div> : null }

              </div>

              <button type="button" className="comparison-image-enlarge" onClick={this.enlargeImage.bind(this, 'b')}>
                <SvgZoomIcon></SvgZoomIcon>
              </button>

              <div className="comparison-desc">&nbsp;{this.state.comparison.b_description}&nbsp;</div>

            </div>

          </div>


          {/* skip
          <div className="comparison-skip">Skip</div> */}


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
    fetchUser: function() {
      dispatch( actions.fetchUser() );
    },
    openImgViewer: function(url) {
      dispatch( actions.openImgViewer(url) );
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
