import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import MachineList from './MachineList';
import Machine from './Machine';

class MachineContainer extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/machines/page/:page' exact component={MachineList} />
          <Route path='/machines/:id' exact component={Machine} />
        </Switch>
      </div>
    );
  }
}

export default MachineContainer;
