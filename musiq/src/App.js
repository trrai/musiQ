'use strict';

import React, { Component } from 'react'; //import React Component
import './App.css';
import MusiQHome from './components/Home';
import MusiQNavbar from './components/Navbar';
import MusiQCreate from './components/Create';
import MusiQRoom from './components/Room';
import MusiQJoin from './components/Join';
import { Router, Route, Link, Switch, Redirect } from 'react-router-dom';

//Forms 
import SignUpForm from './SignUp';
import SignInForm from './SignIn';

//Firebase Imports
import firebase, { storage } from 'firebase/app';
import {
  Button, Card, CardSubtitle, Input,
  Container, Row, Col, ButtonGroup
} from 'reactstrap';

import BToken from './API_TOKEN.js'

import Spotify from 'spotify-web-api-js';
var api = new Spotify();
api.setAccessToken(BToken);

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      loading: true,
      navOpen: false,
      rooms: [],
      profileInput: {}
    };

  }

  
  componentDidMount() {

    this.authUnRegFunc = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) { //someone logged in
        console.log("LOGGED IN");
        this.setState({ user: firebaseUser, loading: false, login: true, errorMessage: null });
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

    this.convoRef = firebase.database().ref("rooms");
      this.convoRef.on("value", (snapshot) => {
        if (snapshot.val() !== null) {
          this.setState({ rooms: snapshot.val() });
        }
      })
  }

  componentWillUnmount() {
    this.authUnRegFunc();
    this.usersRef.off();
    this.profileRef.off();
    this.convoRef.off();
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
        <MusiQNavbar />
        <h1> Sign Up </h1>
        <SignUpForm
          signUpCallback={(e, p, h, a, age, img, img2) => this.handleSignUp(e, p, h, a, age, img, img2)}
          user={this.state.user}
        />

      </div>
    };

    let renderSignIn = (routerProps) => {

      return <div>
        <MusiQNavbar />
        <SignInForm
          signInCallback={(e, p) => this.handleSignIn(e, p)}
          user={this.state.user}
        />
        <Button role="button" color="info" className="mr-2">
          <Link to='/join'>Sign Up</Link>
        </Button>
      </div>

    };

    let renderCreate = (routerProps) => {
      return <div>
      <MusiQNavbar />
      <MusiQCreate />
      </div>
    }

    let renderLanding = (routerProps) => {

      if (this.state.user) {

        return <div>

          <MusiQNavbar />
          <MusiQHome />
          
          {/*<button onClick={() => this.handleSearch("test")}>SKRT</button>*/}
          
        </div>

      } else {
        console.log("there is not a user")
        return <Redirect to='/signin' />
      }

    };

    let renderRoom = (routerProps) => {
    
        return <div>
          <MusiQNavbar />
          <MusiQRoom
            {...routerProps}
            user={this.state.user}
            rooms={this.state.rooms}
            api={api}
          />
        </div>
     

    };

    let renderJoinRoom = (routerProps) => {
      return <div>
        <MusiQNavbar />
        <MusiQJoin 
        {...routerProps}
        />
      </div>
    }

    content = (

      <div /* className="container" */>

        <Switch>
          <Route exact path='/' render={renderLanding} />
          <Route exact path='/joinroom' render={renderJoinRoom} />
          <Route exact path='/join' render={renderSignUp} />
          <Route exact path='/signin' render={renderSignIn} />
          <Route exact path='/create' render={renderCreate} />
          <Route path='/room/:Id' render={renderRoom} />
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
