import React, { Component } from 'react';
import logo from './img/logo.svg';
import './App.css';
import BerryContainer from './components/BerryContainer';
import MachineContainer from './components/MachineContainer';
import PokemonContainer from './components/PokemonContainer';

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <header className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <h1 className='App-title'>Hello there, fellow Pokemoners</h1>
          </header>
          <br />
          <div className='App-body'>
            <p>
              Berries were founded in Gen 2 games. They are used for HP/status
              condition restoriation, stat enhancement and damage negation.
            </p>
            <Link className='link' to='/berries/page/0' target='_self'>
              Berries
            </Link>
            <br />
            <br />
            <p>
              Machines allow the staff to work on the Power Plant by restoring
              operations, restoring the Magnet Train and Lavender Radio Tower.
            </p>
            <Link className='link' to='/machines/page/0' target='_self'>
              Machines
            </Link>
            <br />
            <br />
            <p>
              Pokemon are monsters that have abilities and get trained by
              trainers or fellow Pokemoners and they fight against each other.
            </p>
            <Link className='link' to='/pokemon/page/0' target='_self'>
              Pokemon
            </Link>
            <br />
            <br />
            <Switch>
              <Route path='/berries/' component={BerryContainer} />
              <Route path='/machines/' component={MachineContainer} />
              <Route path='/pokemon/' component={PokemonContainer} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
