'use strict';

import React, { Component } from 'react'; //import React Component
import './App.css';

//Forms 
import SignUpForm from './SignUp';
import SignInForm from './SignIn';

//Chat functionality
//import { ConversationsList, NavDrawer } from './Chat'
//import { ChatRoom } from './ChatRoom'

//Firebase Imports
import firebase, { storage } from 'firebase/app';
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import {
  Button, Card, CardSubtitle, Input,
  Container, Row, Col, ButtonGroup
} from 'reactstrap';


//Material UI Imports
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

//md5 Import
//import md5 from 'md5';

//Additional Feature imports
//import { EditPage } from './EditPage'
//import { MatchPage } from './MatchPage'

class TopHeader extends Component {
  render() {

    return (
      <MuiThemeProvider>
        <AppBar
          className="mb-2"
          title={this.props.title}
          onLeftIconButtonTouchTap={() => this.props.toggleNavCallback()}
          iconElementRight={<IconButton role="button" aria-label="show more"><MoreVertIcon /></IconButton>}
          onRightIconButtonTouchTap={() => this.props.toggleFilterCallback()}
        />
      </MuiThemeProvider>
    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      navOpen: false,
      profileInput: {}
    };

  }

  componentDidMount() {

    this.authUnRegFunc = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) { //someone logged in
        this.setState({ user: firebaseUser, loading: false, login: true, errorMessage: null});
        this.profileRef = firebase.database().ref("users/" + this.state.user.uid);
        this.profileRef.on("value", (snapshot) => {
          console.log(snapshot.val());
          this.setState({ userProfile: snapshot.val() });
        });
      }
      else { //someone logged out 
        this.setState({ user: null, userProfile: null, loading: false, login: false });
      }
      console.log(this.state);
    });

  } 

  handleSignIn(email, password) {
    this.setState({ errorMessage: null }); //clear any old errors

    /* TODO: sign in user here */
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.profileRef.on("value", (snapshot) => {
          this.setState({ userProfile: snapshot.val() });
        });
      })
      .catch((err) => {
        this.setState({ errorMessage: err.message })
      });

  }
  
  handleSignUp(email, password, handle, userAge) {

    this.setState({ errorMessage: null, profileInput: { name: handle } }); //clear any old errors

    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        let promise = user.updateProfile({ displayName: handle })
        return promise;
      })
      .catch((err) => this.setState({ errorMessage: err.message }))
      .then(() => {
        this.setState({ email: '', password: '' });
      });

  }

  render() {
    let content = null;

    // Rendering content for when the route is signing up
    let renderSignUp = (routerProps) => {
      return <div>
        <TopHeader
          className="mb-4"
          title="Sign Up!"
          toggleNavCallback={() => this.toggleNav()}
          toggleFilterCallback={() => this.toggleFilter()}
        />
        <h1> Sign Up </h1>
        <SignUpForm
          signUpCallback={(e, p, h, a, age, img, img2) => this.handleSignUp(e, p, h, a, age, img, img2)}
          user={this.state.user}
        />

      </div>
    };

    let renderSignIn = (routerProps) => {

      return <div>
        <TopHeader
          className="mb-4"
          title="Sign in!"
          toggleNavCallback={() => this.toggleNav()}
          toggleFilterCallback={() => this.toggleFilter()}
        />
        <SignInForm
          signInCallback={(e, p) => this.handleSignIn(e, p)}
          user={this.state.user}
        />
        <Button role="button" color="info" className="mr-2">
          <Link to='/join'>Sign Up</Link>
        </Button>
      </div>

    };

    let renderLanding = (routerProps) => {

      if (this.state.user) {

        return <p>Skrt skrt you're logged in cudddddy</p>

      } else {
        return <Redirect to='/signin' />
      }

    };

    content = (

      <div className="container">

        <Switch>
          <Route exact path='/' render={renderLanding} />
          <Route exact path='/join' render={renderSignUp} />
          <Route exact path='/signin' render={renderSignIn} />
        </Switch>

      </div>

    );

      return (
        <div className="hundred_height">
          {this.state.errorMessage &&
            <p className="alert alert-danger">{this.state.errorMessage}</p>
          }
          {content}
        </div>
      );
    

  }
}

export default App;