import 'bootstrap/dist/css/bootstrap.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import createSagaMiddleware from 'redux-saga';
import workspace from './reducers';
import rootSaga from './sagas';
import App from './App';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  workspace,
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(rootSaga);

const root = document.getElementById('root');
const load = () => render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ), root,
);


load();
