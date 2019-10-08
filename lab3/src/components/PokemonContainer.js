import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import PokemonList from './PokemonList';
import Pokemon from './Pokemon';

class PokemonContainer extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/pokemon/page/:page' exact component={PokemonList} />
          <Route path='/pokemon/:id' exact component={Pokemon} />
        </Switch>
      </div>
    );
  }
}

export default PokemonContainer;
