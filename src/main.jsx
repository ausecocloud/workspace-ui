import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import blockUiMiddleware from 'react-block-ui/reduxMiddleware';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';
import { loadConfig } from './config';
import { initAuth } from './api';
import App from './App';


const sagaMiddleware = createSagaMiddleware();

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();
// Build the middleware for intercepting and dispatching navigation actions
const middleware = [
  sagaMiddleware,
  blockUiMiddleware,
  routerMiddleware(history),
];

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer,
  }),
  composeWithDevTools(applyMiddleware(...middleware)),
);

sagaMiddleware.run(rootSaga);

const root = document.getElementById('root');
const load = () => render(
  (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  ), root,
);

// load configuration and init keycloak client, and delay mounting of App,
// to avoid at least one page flicker
loadConfig('/config.json')
  .then(config => initAuth(config.keycloak, store))
  .then(() => load());

// load();
