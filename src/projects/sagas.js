import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { workspace } from '../api';
import * as actions from './actions';


function* projectsTask() {
  try {
    const projects = yield call(workspace.listProjects);
    yield put(actions.projectsSucceeded(projects));
  } catch (error) {
    yield put(actions.projectsFailed(error));
  }
}


function* projectsSelectTask(action) {
  try {
    yield put(actions.contentsPath({ project: action.payload, path: '/' }));
  } catch (error) {
    console.log('Projects Select Task failed', error);
  }
}


function* projectCreateTask(action) {
  try {
    const project = yield call(workspace.createProject, action.payload);
    yield put(actions.createProjectSucceeded(project));
  } catch (error) {
    yield put(actions.createProjectFailed(error));
  }
}


function* contentsTask(action) {
  try {
    const contents = yield call(workspace.listContents, action.payload);
    yield put(actions.contentsSucceeded(contents));
  } catch (error) {
    yield put(actions.contentsFailed(error));
  }
}


function* addFolderTask(action) {
  try {
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
  yield takeLatest(actions.PROJECTS_LIST, projectsTask);
  yield takeLatest(actions.PROJECTS_SELECT, projectsSelectTask);
  yield takeEvery(actions.PROJECTS_ADD, projectCreateTask);
  yield takeLatest(actions.CONTENTS_PATH, contentsTask);
  yield takeEvery(actions.FOLDER_ADD, addFolderTask);
  yield takeEvery(actions.FOLDER_DELETE, deleteFolderTask);
  yield takeEvery(actions.FILE_UPLOAD, uploadFileTask);
  yield takeEvery(actions.FILE_DELETE, deleteFileTask);
}
