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


function* projectsSelectTask(action) {
  yield put(actions.contentsPath({ project: action.payload, path: '/' }));
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


function* addFolderTask(action) {
  try {
    // let response =
    yield call(API.addFolder, action.payload);
    console.log('Folder created');
    yield put(actions.contentsPath(action.payload));
    console.log('Path reloaded');
  } catch (error) {
    yield put(actions.addFolderFailed(error));
  }
}


export default function* projectsSaga() {
  // start yourself
  yield takeEvery(actions.PROJECTS_LIST, projectsTask);
  yield takeEvery(actions.PROJECTS_SELECT, projectsSelectTask);
  yield takeEvery(actions.CONTENTS_PATH, contentsTask);
  yield takeEvery(actions.FOLDER_ADD, addFolderTask);
}
