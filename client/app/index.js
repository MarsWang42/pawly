import React from 'react';
import Immutable from 'immutable';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose} from 'redux';
import { install } from 'redux-loop';
import { createLogger } from 'redux-logger';

import App from './containers/App';
import reducer from './reducers';

// Polyfill to get clarifai work
process.nextTick = setImmediate;

const stateTransformer = (state) => {
  let newState = {};

  if (typeof state === "object" && state !== null && Object.keys(state).length) {
    for (var i of Object.keys(state)) {
      if (Immutable.Iterable.isIterable(state[i])) {
        newState[i] = state[i].toJS();
      } else {
        newState[i] = stateTransformer(state[i]);
      }
    }
  } else {
    newState = state;
  }
  return newState;
};

// middleware that logs actions
const loggerMiddleware = createLogger({ stateTransformer });

let middlewares = []

if (__DEV__) {
  middlewares = [ ...middlewares, loggerMiddleware ]
}

function configureStore(initialState) {
  const enhancer = compose(
    install(),
    applyMiddleware(...middlewares),
  );
  return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

const Fabric = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Fabric;
