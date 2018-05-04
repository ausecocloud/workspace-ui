import { put, takeEvery, fork } from 'redux-saga/effects';
import * as actions from './actions';
import projectsSaga from './projects/sagas';
import computeSaga from './compute/sagas';
import { getKeycloak } from './api';

// the task to fetch an access token
export function* loginTask() {
  try {
    const kc = getKeycloak();
    if (!kc.authenticated) {
      yield kc.login();
    }
    console.log('AUTH:', kc.authenticated);
    if (kc.authenticated) {
      yield put(actions.loginSucceeded(kc));
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
    const kc = getKeycloak();
    if (kc.authenticated) {
      yield kc.logout();
    }
    if (!kc.authenticated) {
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
  yield fork(computeSaga);
}
