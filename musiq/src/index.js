import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database'

var config = {
  apiKey: "AIzaSyBUqkbncNlr_eZ78B-ALe9cY1N0JZJbQq8",
  authDomain: "musiq-9a7ff.firebaseapp.com",
  databaseURL: "https://musiq-9a7ff.firebaseio.com",
  projectId: "musiq-9a7ff",
  storageBucket: "",
  messagingSenderId: "816834720556"
};
firebase.initializeApp(config);

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<BrowserRouter basename={process.env.PUBLIC_URL + '/'}><App /></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
