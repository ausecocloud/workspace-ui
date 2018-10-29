import { delay } from 'redux-saga';
import {
  call, put, race, take, takeLatest, takeEvery,
} from 'redux-saga/effects';
import { jupyterhub } from '../api';
import * as actions from './actions';


// fetch list of users servers
// this could have been moved into serversPollTask, but having it separate
// makes it reusable with the repeating poll
function* serversTask(action) {
  try {
    // Call the API
    const user = yield call(jupyterhub.getUser, action.payload);

    // Parse response
    const serverkeys = Object.keys(user.servers).sort();
    const servers = serverkeys.map(key => user.servers[key]);

    // Update server list
    yield put(actions.serversSucceeded(servers));
  } catch (error) {
    yield put(actions.serversFailed(error));
  }
}

function* serversPollTask(action) {
  while (true) {
    try {
      // Trigger a new fetch of the server list
      yield put(actions.serversList(action.payload));

      // Wait for response
      yield take([
        actions.SERVERS_LIST_SUCCEEDED,
        actions.SERVERS_LIST_FAILED,
      ]);

      // Wait 10 secconds and start over
      yield call(delay, 10000);
    } catch (error) {
      console.error('servers poll task failed. keep retrying', error);
    }
  }
}

// keep fetching servers while polling is active
function* serversWatchStopTask(action) {
  try {
    yield race({
      // start the serversPollTask... it will never stop
      servers: call(serversPollTask, action),
      // in parallel wait for servers list stop event,
      // whne received it will cancel the poll task as well
      stop: take(actions.SERVERS_LIST_STOP),
    });
  } catch (error) {
    console.error('servers watch stop task failed.', error);
  }
}

/**
 * Task for terminating a given user's JupyterHub server
 *
 * @param {object} action Action object, with username as payload
 */
function* serverTerminateTask(action) {
  try {
    const data = yield call(jupyterhub.terminateServer, action.payload);
    yield put(actions.serverTerminateSucceeded(data));
  } catch (error) {
    yield put(actions.serverTerminateFailed(error));
  } finally {
    // Immediately update server status again
    yield put(actions.serversList(action.payload));
  }
}

export default function* computeSaga() {
  // start yourself
  yield takeLatest(actions.SERVERS_LIST, serversTask);
  // kick off servers list task, on restart it will cancel already running tasks
  yield takeLatest(actions.SERVERS_LIST_START, serversWatchStopTask);
  yield takeEvery(actions.SERVER_TERMINATE, serverTerminateTask);
}
