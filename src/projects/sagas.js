import { call, put, takeEvery } from 'redux-saga/effects';
import * as API from '../api';
import * as actions from './actions';


function* projectsTask() {
  let projects;
  try {
    projects = yield call(API.listProjects);
    yield put(actions.projectsSucceeded(projects));
  } catch (error) {
    yield put(actions.projectsFailed(error));
  }
}


function* contentsTask(action) {
  let contents;
  try {
    contents = yield call(API.listContents, action.payload);
    yield put(actions.contentsSucceeded(contents));
  } catch (error) {
    yield put(actions.contentsFailed(error));
  }
}

export default function* projectsSaga() {
  // start yourself
  yield takeEvery(actions.PROJECTS_LIST, projectsTask);
  yield takeEvery(actions.PROJECTS_SELECT, contentsTask);
  yield takeEvery(actions.CONTENTS_PATH, contentsTask);
}
