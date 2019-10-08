import React, { Component } from 'react';
import axios from 'axios';

class Berry extends Component {
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
    this.getBerry();
  }
  async getBerry() {
    this.setState({
      loading: true,
    });
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/berry/${this.props.match.params.id}`,
      );
      this.setState({
        data: response.data,
        loading: false,
      });
    } catch (e) {
      this.setState({
        hasError: true,
        error: `berry ain't found ... ${e}`,
      });
    }
  }
  render() {
    let body = null;
    body = (
      <div>
        <h1 className='cap-first-letter'>
          {this.state.data && this.state.data.name}
        </h1>
        <br />
        <p>
          Growth Time: {this.state.data && this.state.data.growth_time}
          <br />
          Max Harvest: {this.state.data && this.state.data.max_harvest}
          <br />
          Size: {this.state.data && this.state.data.size}
          <br />
          Firmness: {this.state.data && this.state.data.firmness.name}
          <br />
          Item: {this.state.data && this.state.data.item.name}
          <br />
        </p>
        <b>Flavors</b>:
        <ul className='list-unstyled'>
          {this.state.data &&
            this.state.data.flavors.map(flavor => {
              return (
                <li key={flavor.flavor.name}>
                  {flavor.flavor.name}: {flavor.potency}
                </li>
              );
            })}
        </ul>
      </div>
    );
    if (this.state.hasError) {
      return <div>{this.state.error}</div>;
    }
    return body;
  }
}

export default Berry;
