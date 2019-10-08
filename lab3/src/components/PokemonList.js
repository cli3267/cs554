import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

class PokemonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      next: 'https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20',
      previous: null,
      data: undefined,
      loading: false,
      currentPg: 0,
      total: 0,
      hasError: false,
      error: null,
    };
  }
  async getPokemon(page) {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/?offset=${page * 20}&limit=20`,
      );
      this.setState({
        data: response.data.results,
        previous: response.data.previous,
        next: response.data.next,
        total: Math.ceil(response.data.count / 20),
      });
      if (page >= this.state.total) {
        throw Object.assign(new Error(`yikes you went a little too deep`), {
          code: 404,
        });
      }
    } catch (e) {
      this.setState({
        hasError: true,
        error: `yikes, their ain't that many pokemons...${e}`,
      });
    }
  }
  componentDidMount() {
    this.getPokemon(this.props.match.params.page);
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.currentPg !== prevState.currentPg) {
      this.props.history.push(`/pokemon/page/${this.state.currentPg}`);
      this.getPokemon(this.state.currentPg);
    }
  }

  async increment() {
    this.setState({
      currentPg: this.state.currentPg + 1,
    });
  }

  async decrement() {
    this.setState({
      currentPg: this.state.currentPg - 1,
    });
  }
  render() {
    let body = null;
    let li = null;
    let pagination = null;
    li =
      this.state.data &&
      this.state.data.map(pokemon => (
        <li key={pokemon.name}>
          <Link to={`/pokemon/${pokemon.url.match(/(\d+)/g)[1]}`}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Link>
        </li>
      ));
    body = (
      <div>
        <ul className='list-unstyled'>{li}</ul>
      </div>
    );
    console.log(this.state.currentPg, this.state.total);
    pagination = (
      <div>
        {this.state.currentPg === 0 ? (
          ''
        ) : (
          <Button
            className='pagination-previous'
            onClick={this.decrement.bind(this)}
          >
            Prev
          </Button>
        )}
        {this.state.currentPg === this.state.total - 1 ? (
          ''
        ) : (
          <Button
            className='pagination-next'
            onClick={this.increment.bind(this)}
          >
            Next
          </Button>
        )}
      </div>
    );
    if (this.state.hasError) {
      return <div className='font-weight-bold'>{this.state.error}</div>;
    }
    return (
      <div>
        {body}
        {pagination}
      </div>
    );
  }
}

export default PokemonList;
