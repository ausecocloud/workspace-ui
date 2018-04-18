import { call, put, takeEvery, fork } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import * as API from './api';
import * as actions from './actions';
import projectsSaga from './projects/sagas';


// the task to fetch an access token
export function* loginTask() {
  let tokens;
  try {
    tokens = yield call(API.fetchToken);
    yield put(actions.tokenSucceeded(tokens));
  } catch (error) {
    yield put(actions.tokenFailed(error));
  }
  if (tokens && tokens.expires_in) {
    yield call(delay, tokens.expires_in * 500);
  } else {
    yield call(delay, 10000);
  }
  yield put(actions.tokenFetch());
}


// lanch above task on every ACCES_TOKEN_FETCH
export default function* rootSaga() {
  // start yourself
  yield takeEvery(actions.TOKEN_FETCH, loginTask);
  yield fork(projectsSaga);
  // start token fetcher
  yield put(actions.tokenFetch());
}
