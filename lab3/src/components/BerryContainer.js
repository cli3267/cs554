import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import BerriesList from './BerriesList';
import Berry from './Berry';

class ShowsContainer extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/berries/page/:page' exact component={BerriesList} />
          <Route path='/berries/:id' exact component={Berry} />
        </Switch>
      </div>
    );
  }
}

export default ShowsContainer;
