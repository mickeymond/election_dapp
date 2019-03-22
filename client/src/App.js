import React, { Component } from 'react';
import { DrizzleContext } from 'drizzle-react';
import 'semantic-ui-css/semantic.min.css'
import 'toastr/build/toastr.min.css'

import Election from './components/Election';
import Spinner from './components/Spinner';

class App extends Component {

  state = { loading: false };

  showLoader() {
    this.setState({ loading: true });
  }

  hideLoader() {
    this.setState({ loading: false });
  }

  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
      
          if (!initialized || this.state.loading) {
            return (
              <div className="container text-center mt-5">
                <Spinner />
              </div>
            );
          }
    
          return (
            <div className="container text-center mt-5">
              <Election
                drizzle={drizzle}
                drizzleState={drizzleState}
                showLoader={this.showLoader.bind(this)}
                hideLoader={this.hideLoader.bind(this)}
              />
            </div>
          );
        }}
      </DrizzleContext.Consumer>
    );
  }
}

export default App;
