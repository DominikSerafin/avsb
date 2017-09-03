/*------------------------------------*\
  Todo
\*------------------------------------*/
// - ask on stackoverflow why input[type=file] gives a react 'controlled input' warning



/*------------------------------------*\
  Imports
\*------------------------------------*/
import React from 'react';
import * as ReactRedux from 'react-redux';
import {NavLink} from 'react-router-dom';
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
      validate: null,
      progress: false,
      created: false,
      a_image_preview: null,
      b_image_preview: null,
      new: {
        title: '',
        a_image: null,
        a_description: '',
        b_image: null,
        b_description: '',
      },
    }
  }

  constructor(props) {
    super(props);
    this.constructor.displayName = 'ComparisonNew';
    this.state = this.initialState();
    this.imageOnChange = this.imageOnChange.bind(this);
    this.submit = this.submit.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  componentDidMount(){
    this.props.fetchUser();
  }

  contentTypeIsImage(contentType){
    var goodContentTypes = [
      'image/jpeg', 'image/png', 'image/gif', /*'image/bmp',*/ 'image/webp', /*'image/svg+xml', 'image/ico',*/
    ]
    if (goodContentTypes.indexOf(contentType.toLowerCase()) > -1) {
      return true;
    }
    return false;
  }

  contentTypeIsGif(contentType){
    if (contentType.toLowerCase() === 'image/gif') {
      return true;
    }
    return false;
  }

  validateImageInput(input){

    var pass = true;

    if (!input.files.length) {
      pass = false;
    }

    if (input.files.length && !this.contentTypeIsImage(input.files[0].type)) {
      alert('Only JPG/JPEG, PNG, WEBP and GIF (without animation) file types are supported.');
      pass = false;
    }

    if (input.files.length && this.contentTypeIsGif(input.files[0].type)) {
      alert('Gif files are not fully supported yet. Only first frame will be visible in final comparison.');
      pass = true;
    }

    if (!pass) {
      // reset input
      input.value = '';
      input.type = ''
      input.type = 'file'
    }

    return pass;

  }

  imageOnChange(aorb){

    var input = this['_'+aorb+'_image_input'];
    //var img = this['_'+aorb+'_image_img'];

    // reset preview
    this.setState({[aorb+'_image_preview']: ''});

    if (!this.validateImageInput(input)) {
      return;
    }

    var freader = new FileReader();
    freader.onloadend = function(event){
      //this.setState({[aorb+'_image_preview']: event.target.result});
      this.setState({[aorb+'_image_preview']: freader.result});
    }.bind(this);
    freader.readAsDataURL(input.files[0]);

    var newNewState = this.state.new;
    newNewState[aorb+'_image'] = input.files[0];
    this.setState({new: newNewState});

  }

  inputChange(event){

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    var stateNew = this.state.new;

    stateNew[name] = value;
    this.setState({
      new: stateNew,
    });

  }

  setProgress(progressEvent) {
    var percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
    if (percentCompleted===100) {
      this.setState({progress: 'Processing...'});
    } else {
      this.setState({progress: percentCompleted + '%'});
    }
  }

  submit() {

    this.setState({ validate: true });

    if (!this.state.new.a_image || !this.state.new.b_image) {
      return;
    }

    if (this.state.progress) {
      return;
    }

    var formData = new FormData();
    formData.append('title', this.state.new.title);
    formData.append('a_image', this.state.new.a_image);
    formData.append('a_description', this.state.new.a_description);
    formData.append('b_image', this.state.new.b_image);
    formData.append('b_description', this.state.new.b_description);

    axios({
      method: 'post',
      url: this.props.state.server + '/comparison/new',
      data: formData,
      onUploadProgress: function(progressEvent) {
        this.setProgress(progressEvent);
      }.bind(this),
    }).then(function(response){
      this.props.fetchUser();
      //this.props.history.push('/'+response.data.slug);
      this.setState({
        created: response.data,
      });
    }.bind(this), function(error){
      alert(`Something went wrong while adding Comparison: ${JSON.stringify(error.response.data)}`);
      //console.error(error);
      window.location.reload();
    }.bind(this));

  }


}



/*------------------------------------*\
  Functional
\*------------------------------------*/
const Limit = (props) => (
  <div className="comparison-limit">
    <div>
    You need to give {props.remaining} more vote{props.remaining===1?'':'s'} to create new Comparison.
      { props.votedOnEverything ?
        <div>You&apos;ve voted on everything. You need to wait until someone else adds new Comparison.</div> : null}
    </div>
  </div>
)

const ComparisonCreated = (props) => (
  <div className="comparison-created">
    <div>
      <div>Comparison was created...</div>
      <div>
        <NavLink className="comparison-created-link" to={'/'+props.slug}>
          <span>{window.location.host}/</span><span>{props.slug}</span>
        </NavLink>
      </div>
    </div>
  </div>
)

const SpinnerWrapper = (props) => (
  <div className="comparison-spinner"><Spinner></Spinner></div>
)



/*------------------------------------*\
  Render
\*------------------------------------*/
Component.prototype.render = function() {

  var user = this.props.state.user;

  if (!user || user.available_comparisons===null) {
    return <SpinnerWrapper></SpinnerWrapper>
  }

  if (this.state.created) {
    return <ComparisonCreated slug={this.state.created.slug}></ComparisonCreated>
  }

  if (user && user.available_comparisons!==null && user.available_comparisons<1) {
    return <Limit remaining={user.next_comparison_votes_remaining} votedOnEverything={user.voted_on_everything}></Limit>
  }

  if (user && user.available_comparisons) {

    return (
      <div className="comparison mod-new">
        <div className="comparison-inner">

          <input type="text" className="comparison-title" placeholder="Which one do you prefer?"
            name="title"
            value={this.state.new.title}
            onChange={this.inputChange}
          />

          <div className="comparison-items">


            {/* item */}
            <div className="comparison-item">

              <div className={['comparison-image', 'mod-upload',
                this.state.validate && !this.state.new.a_image ? 'mod-invalid':''
              ].join(' ')}>


                <label htmlFor="a_image">

                  {this.state.a_image_preview ?
                    <img ref={e=>this._a_image_img=e} src={this.state.a_image_preview} alt=""/>
                    : <span>Image...</span>}

                </label>

                <input type="file" id="a_image" name="a_image"
                  ref={e=>this._a_image_input=e}
                  onChange={this.imageOnChange.bind(this, 'a')}
                />

              </div>

              <input type="text" className="comparison-desc" placeholder="Caption..."
                name="a_description"
                value={this.state.new.a_description}
                onChange={this.inputChange}
              />


            </div>

            {/* between
            <div className="comparison-between"></div>*/}


            {/* item */}
            <div className="comparison-item">

              <div className={['comparison-image', 'mod-upload',
                this.state.validate && !this.state.new.b_image ? 'mod-invalid':''
              ].join(' ')}>

                <label htmlFor="b_image">

                  {this.state.b_image_preview ?
                    <img ref={e=>this._b_image_img=e} src={this.state.b_image_preview} alt=""/> : <span>Image...</span>}

                </label>

                <input type="file" id="b_image" name="b_image"
                  ref={e=>this._b_image_input=e}
                  onChange={this.imageOnChange.bind(this, 'b')}
                />

              </div>

              <input type="text" className="comparison-desc" placeholder="Caption..."
                name="b_description"
                value={this.state.new.b_description}
                onChange={this.inputChange}
              />

            </div>


            {/* these buttons need to be inside "comparison-items",
                so when user switches between Comparison and ComparisonNew
                the layout stays exactly in the same place */}
            {this.state.progress ?
              <button className="comparison-submit" type="button">{this.state.progress}</button> :
              <button className="comparison-submit" type="button" onClick={this.submit}>Create</button>
            }


          </div>


        </div>
      </div>
    );

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
