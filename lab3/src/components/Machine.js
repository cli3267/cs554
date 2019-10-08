import React, { Component } from 'react';
import axios from 'axios';

class Machine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      loading: false,
      hasError: false,
      error: null,
    };
  }
  componentWillMount() {
    this.getMachine();
  }
  async getMachine() {
    this.setState({
      loading: true,
    });
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/machine/${this.props.match.params.id}`,
      );
      this.setState({
        data: response.data,
        loading: false,
      });
    } catch (e) {
      this.setState({
        hasError: true,
        error: `machine ain't found ... ${e}`,
      });
    }
  }
  render() {
    let body = null;
    body = (
      <div>
        <h1 className='cap-first-letter'>
          {this.state.data && this.state.data.item.name}
        </h1>
        <br />
        <p>
          Move: {this.state.data && this.state.data.move.name}
          <br />
          Version Group: {this.state.data && this.state.data.version_group.name}
          <br />
        </p>
      </div>
    );
    if (this.state.hasError) {
      return <div>{this.state.error}</div>;
    }
    return body;
  }
}

export default Machine;
