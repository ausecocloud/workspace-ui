import { call, put, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import * as API from './api';
import * as actions from './actions';


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

export function* projectsTask() {
  let projects;
  try {
    projects = yield call(API.listProjects);
    yield put(actions.projectsSucceeded(projects));
  } catch (error) {
    yield put(actions.projectsFailed(error));
  }
}


export function* contentsTask(action) {
  let contents;
  try {
    contents = yield call(API.listContents, action.payload);
    yield put(actions.contentsSucceeded(contents));
  } catch (error) {
    yield put(actions.contentsFailed(error));
  }
}

// lanch above task on every ACCES_TOKEN_FETCH
export default function* rootSaga() {
  // start yourself
  yield takeEvery(actions.TOKEN_FETCH, loginTask);
  yield takeEvery(actions.PROJECTS_LIST, projectsTask);
  yield takeEvery(actions.PROJECTS_SELECT, contentsTask);
  // start token fetcher
  yield put(actions.tokenFetch());
}
