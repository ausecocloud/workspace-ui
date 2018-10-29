import 'bootstrap/dist/css/bootstrap.css';
import 'react-block-ui/style.css';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import blockUiMiddleware from 'react-block-ui/reduxMiddleware';
import createHistory from 'history/createBrowserHistory';
import {
  ConnectedRouter, routerReducer, routerMiddleware, LOCATION_CHANGE,
} from 'react-router-redux';
import { createMiddleware } from 'redux-beacon';
import GoogleAnalytics, { trackPageView } from '@redux-beacon/google-analytics';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';
import { loadConfig } from './config';
import { initAuth } from './api';
import App from './App';


const sagaMiddleware = createSagaMiddleware();

// Google analytics redux beacon init
const eventsMap = {
  [LOCATION_CHANGE]: trackPageView(action => ({
    page: action.payload.pathname,
  })),
};
const gaMiddleware = createMiddleware(eventsMap, GoogleAnalytics());

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();
// Build the middleware for intercepting and dispatching navigation actions
const middleware = [
  sagaMiddleware,
  blockUiMiddleware,
  routerMiddleware(history),
  gaMiddleware,
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

const initGA = (config) => {
  // Analytics
  // Creates an initial ga() function.
  // The queued commands will be executed once analytics.js loads.
  window.ga = window.ga || function qaQueue(...rest) {
    (window.ga.q = window.ga.q || []).push(...rest);
  };

  // Sets the time (as an integer) this tag was executed.
  // Used for timing hits.
  window.ga.l = +new Date();

  // Creates a default tracker with automatic cookie domain configuration.
  window.ga('create', config.tracking_id, 'auto');

  // Sends a pageview hit from the tracker just created.
  // not needed, router registers a pageview for first load
  // window.ga('send', 'pageview');
};

// load configuration and init keycloak client, and delay mounting of App,
// to avoid at least one page flicker
loadConfig('/config.json')
  .then((config) => {
    initAuth(config.keycloak, store);
    if (config.googleAnalytics.tracking_id) {
      initGA(config.googleAnalytics);
    }
  })
  .then(() => load());
// load();
