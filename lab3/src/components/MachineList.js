import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

class MachineList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      next: 'https://pokeapi.co/api/v2/machine/?offset=20&limit=20',
      previous: null,
      data: undefined,
      loading: false,
      currentPg: 0,
      total: 0,
      hasError: false,
      error: null,
    };
  }
  async getMachines(page) {
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/machine/?offset=${page * 20}&limit=20`,
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
        error: `404, yikes, their ain't that many machines...${e}`,
      });
    }
  }
  componentDidMount() {
    this.getMachines(this.props.match.params.page);
  }

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.currentPg !== prevState.currentPg) {
      this.props.history.push(`/machines/page/${this.state.currentPg}`);
      this.getMachines(this.state.currentPg);
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
    let error = null;
    li =
      this.state.data &&
      this.state.data.map(machine => (
        <li key={machine.url}>
          <Link to={`/machines/${machine.url.match(/(\d+)/g)[1]}`}>
            Machine {machine.url.match(/(\d+)/g)[1]}
          </Link>
        </li>
      ));
    error = (
      <div>
        {this.state.currentPg > this.state.total ? this.state.error : ''}
      </div>
    );
    body = (
      <div>
        <ul className='list-unstyled'>{li}</ul>
      </div>
    );
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
      return <div class='font-weight-bold'>{this.state.error}</div>;
    }
    return (
      <div>
        {error}
        {body}
        {pagination}
      </div>
    );
  }
}

export default MachineList;
