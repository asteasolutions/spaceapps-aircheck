import React from 'react';
import Relay from 'react-relay';
import { Provider } from 'react-redux';
import { RelayRouter } from 'react-router-relay';
import { Route, browserHistory } from 'react-router';
import configureStore from '../store/configureStore';
import Home from '../components/Home';

const store = configureStore();

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:1234/graphql'),
);

export default () => (
  <Provider store={store}>
    <RelayRouter history={browserHistory}>
      <Route
        path='/'
        component={Home}
        queries={{
          viewer: () => Relay.QL`
            query { viewer }
          `,
        }}
      />
    </RelayRouter>
  </Provider>
);
