import React from 'react';
import App from './containers/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose} from 'redux';
import { install } from 'redux-loop';
import { createLogger } from 'redux-logger';
import reducer from './reducers';

// middleware that logs actions
const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__  });

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
