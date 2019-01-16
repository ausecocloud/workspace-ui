import { delay } from 'redux-saga';
import {
  call, cancelled, put, race, take, takeLatest,
} from 'redux-saga/effects';
import { jupyterhub, tokens } from '../api';
import * as actions from './actions';


function* fetchProfilesTask() {
  try {
    const profiles = yield call(jupyterhub.getProfiles);
    yield put(actions.profilesSucceeded(profiles));
  } catch (error) {
    yield put(actions.profilesFailed(error));
  } finally {
    if (yield cancelled()) {
      yield put(actions.profilesFailed('fetchProfilesTask cancelled'));
    }
  }
}

function* fetchAuthorizationsTask() {
  try {
    const authorizations = yield call(tokens.authorizations);
    yield put(actions.tokensAuthorizationsSucceeded(authorizations));
  } catch (error) {
    yield put(actions.tokensAuthorizationsFailed(error));
  } finally {
    if (yield cancelled()) {
      yield put(actions.tokensAuthorizationsFailed('fetchAuthorizationsTask cancelled'));
    }
  }
}

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
  } finally {
    if (yield cancelled()) {
      yield put(actions.serversFailed('serversTask cancelled'));
    }
  }
}

function* serversPollTask(action) {
  while (true) {
    try {
      // Trigger a new fetch of the server list
      yield put(actions.serversList(action.payload, { poll: true }));
      // TODO: if serversListSucceeded takes longer than 10 seconds, then we'll
      //       never see a list result, because this task will trigger a new
      //       serversList and cancels the previous one.
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

function* serverLaunchTask(action) {
  try {
    yield call(jupyterhub.launchServer, action.payload);
    yield put(actions.serverLaunchSucceeded());
  } catch (error) {
    yield put(actions.serverLaunchFailed(error));
  } finally {
    // Immediately update server status again
    yield put(actions.serversList(action.payload.username));
    if (yield cancelled()) {
      yield put(actions.serverLaunchFailed('serverLaunchTask cancelled'));
    }
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
    if (yield cancelled()) {
      yield put(actions.serverTerminateFailed('serverTerminateTaks cancelled'));
    }
  }
}


export default function* computeSaga() {
  yield takeLatest(actions.PROFILES_FETCH, fetchProfilesTask);
  yield takeLatest(actions.TOKENS_AUTHORIZATIONS, fetchAuthorizationsTask);
  // start yourself
  yield takeLatest(actions.SERVERS_LIST, serversTask);
  // kick off servers list task, on restart it will cancel already running tasks
  yield takeLatest(actions.SERVERS_LIST_START, serversWatchStopTask);
  yield takeLatest(actions.SERVER_LAUNCH, serverLaunchTask);
  yield takeLatest(actions.SERVER_TERMINATE, serverTerminateTask);
}
