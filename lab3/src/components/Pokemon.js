import React, { Component } from 'react';
import axios from 'axios';

class Pokemon extends Component {
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
        `https://pokeapi.co/api/v2/pokemon/${this.props.match.params.id}`,
      );
      this.setState({
        data: response.data,
        loading: false,
      });
    } catch (e) {
      this.setState({
        hasError: true,
        error: `pokemon ain't found ... ${e}`,
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
          Weight: {this.state.data && this.state.data.weight}
          <br />
          Base Experience: {this.state.data && this.state.data.base_experience}
        </p>
        <b>Types:</b>
        <ul className='list-unstyled'>
          {this.state.data &&
            this.state.data.types.map(type => {
              return (
                <li key={type.type.name}>
                  {type.type.name}
                  <br />
                </li>
              );
            })}
        </ul>
        <b>Stats:</b>
        <ul className='list-unstyled'>
          {this.state.data &&
            this.state.data.stats.map(stat => {
              return (
                <li key={stat.stat.name}>
                  Base stat of {stat.stat.name} : {stat.base_stat}
                  <br />
                </li>
              );
            })}
        </ul>
        <b>Abilities:</b>
        <ul className='list-unstyled'>
          {this.state.data &&
            this.state.data.abilities.map(ability => {
              return (
                <li key={ability.ability.name}>
                  {ability.ability.name}
                  <br />
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

export default Pokemon;
