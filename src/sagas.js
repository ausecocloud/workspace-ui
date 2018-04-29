import { select, put, takeEvery, fork } from 'redux-saga/effects';
import * as actions from './actions';
import projectsSaga from './projects/sagas';
import { keycloak } from './api';

// the task to fetch an access token
export function* loginTask() {
  try {
    if (!keycloak.authenticated) {
      yield keycloak.login();
    }
    console.log('AUTH:', keycloak.authenticated);
    if (keycloak.authenticated) {
      yield put(actions.loginSucceeded(keycloak));
    } else {
      yield put(actions.loginFailed());
    }
  } catch (error) {
    console.log('AUTH:', error);
    yield put(actions.loginFailed());
  }
}


export function* logoutTask() {
  try {
    if (keycloak.authenticated) {
      yield keycloak.logout();
    }
    if (!keycloak.authenticated) {
      yield put(actions.logoutSucceeded());
    } else {
      yield put(actions.logoutFailed());
    }
  } catch (error) {
    console.log('LOGOUT:', error);
    yield put(actions.logoutFailed());
  }
}


// lanch above task on every LOGIN
export default function* rootSaga() {
  // start yourself
  yield takeEvery(actions.LOGIN, loginTask);
  yield takeEvery(actions.LOGOUT, logoutTask);
  yield fork(projectsSaga);
}
