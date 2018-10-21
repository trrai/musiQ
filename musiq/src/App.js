import React, { Component } from 'react';
import './App.css';
import MusiQHome from './components/Home';
import MusiQNavbar from './components/Navbar';
import MusiQCreate from './components/Create';
import { Router, Route, Link, Switch } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      navOpen: false,
      profileInput: {}
    };

  }


  render() {
    let content = null;

    let renderLanding = (routerProps) => {
      return <div>
        <MusiQNavbar />
        <MusiQHome />
      </div>
    };

    let renderCreate = (routerProps) => {
      return <div>
        <MusiQNavbar />
        <MusiQCreate />
      </div>
    }
    content = (
      <div>
        <Switch>
          <Route exact path='/' render={renderLanding} />
          <Route exact path='/create' render={renderCreate} />
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
