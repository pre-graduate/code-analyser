
import { Nav, Home, About, Footer } from './components.js';
import { setupToastr } from './common.js';
import ReactDom from 'react-dom';
import React from 'react';

class App extends React.Component {
  constructor() {
    super();
    setupToastr();
    this.state = { selectedTab: 'home' };
  }

  onSelected(tab) {
    this.setState({ selectedTab: tab });
  }

  render() {
    return (
      <div className='container'>
        <div className='plate'>
          <Nav onSelected={tab => this.onSelected(tab)} onShowFiles={() => this.refs.home.showFiles()}>
            <Home ref='home' show={this.state.selectedTab === 'home'} />
            <About ref='about' show={this.state.selectedTab === 'about'} />
          </Nav>
          <Footer />
        </div>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
