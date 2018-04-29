import { call, put, takeEvery } from 'redux-saga/effects';
import { workspace } from '../api';
import * as actions from './actions';


function* projectsTask() {
  let projects;
  try {
    projects = yield call(workspace.listProjects);
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
    contents = yield call(workspace.listContents, action.payload);
    yield put(actions.contentsSucceeded(contents));
  } catch (error) {
    yield put(actions.contentsFailed(error));
  }
}


function* addFolderTask(action) {
  try {
    // let response =
    yield call(workspace.addFolder, action.payload);
    yield put(actions.contentsPath(action.payload));
  } catch (error) {
    yield put(actions.addFolderFailed(error));
  }
}


function* deleteFolderTask(action) {
  try {
    yield call(workspace.deleteFolder, action.payload);
    // TODO: re-think API ... delete path or delete path/name
    const newPath = action.payload.path.split('/').slice(0, -1).join('/');
    yield put(actions.contentsPath({ ...action.payload, path: newPath }));
  } catch (error) {
    yield put(actions.deleteFolderFailed(error));
  }
}


function* uploadFileTask(action) {
  // project, payload, filelist obj.
  try {
    yield call(workspace.uploadFile, action.payload);
    yield put(actions.contentsPath(action.payload));
  } catch (error) {
    yield put(actions.uploadFileFailed(error));
  }
}


function* deleteFileTask(action) {
  try {
    yield call(workspace.deleteFile, action.payload);
    yield put(actions.contentsPath(action.payload));
  } catch (error) {
    yield put(actions.deleteFileFailed(error));
  }
}


export default function* projectsSaga() {
  // start yourself
  yield takeEvery(actions.PROJECTS_LIST, projectsTask);
  yield takeEvery(actions.PROJECTS_SELECT, projectsSelectTask);
  yield takeEvery(actions.CONTENTS_PATH, contentsTask);
  yield takeEvery(actions.FOLDER_ADD, addFolderTask);
  yield takeEvery(actions.FOLDER_DELETE, deleteFolderTask);
  yield takeEvery(actions.FILE_UPLOAD, uploadFileTask);
  yield takeEvery(actions.FILE_DELETE, deleteFileTask);
}
