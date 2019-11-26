import React, { Component } from 'react';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Home from './Home';
import Bin from './Bin';
import MyPost from './MyPost';
import NewPost from './NewPost';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <header>
            <h1 className='App-title text-center'>Binterst</h1>
            <nav className='navbar navbar-inverse navbar-fixed-top'>
              <NavLink className='navlink navbar-brand' to='/'>
                Home
              </NavLink>

              <NavLink className='navlink navbar-brand' to='/my-bin'>
                My Bin
              </NavLink>

              <NavLink className='navlink navbar-brand' to='/my-posts'>
                My Posts
              </NavLink>

              <NavLink className='navlink navbar-brand' to='/new-post'>
                New Posts
              </NavLink>
            </nav>
          </header>
          <Route exact path='/' component={Home} />
          <Route path='/my-bin' component={Bin} />
          <Route path='/my-posts' component={MyPost} />
          <Route path='/new-post' component={NewPost} />
        </div>
      </Router>
    );
  }
}

export default App;
