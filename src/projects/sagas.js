import {
  call, put, takeEvery, takeLatest,
} from 'redux-saga/effects';
import { workspace } from '../api';
import * as actions from './actions';


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
  // payload, filelist obj.
  try {
    yield call(workspace.uploadFile, action.payload);
    yield put(actions.contentsPath(action.payload));
    yield put(actions.uploadFileSucceeded());
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


function* downloadFileTask(action) {
  try {
    // `data` contains the JSON response from the API
    const { data } = yield call(workspace.downloadFile, action.payload);

    // Direct user to the resource to download it
    //
    // The resource location is contained in `tempurl` within the response data
    // object
    window.location.href = data.tempurl;
  } catch (error) {
    // NOTE: Can't do anything about a failed download...
  }
}


function* getStatsTask() {
  try {
    const stats = yield call(workspace.getStats);
    yield put(actions.getStatsSucceeded(stats));
  } catch (error) {
    yield put(actions.getStatsFailed(error));
  }
}


export default function* projectsSaga() {
  // start yourself
  yield takeLatest(actions.CONTENTS_PATH, contentsTask);
  yield takeEvery(actions.FOLDER_ADD, addFolderTask);
  yield takeEvery(actions.FOLDER_DELETE, deleteFolderTask);
  yield takeEvery(actions.FILE_UPLOAD, uploadFileTask);
  yield takeEvery(actions.FILE_DELETE, deleteFileTask);
  yield takeEvery(actions.FILE_DOWNLOAD, downloadFileTask);
  yield takeLatest(actions.PROJECTS_STATS, getStatsTask);
}
