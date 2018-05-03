import { delay } from 'redux-saga';
import { call, put, race, take, takeLatest } from 'redux-saga/effects';
import { jupyterhub } from '../api';
import * as actions from './actions';


// fetch list of users servers
// this could have been moved into serversPollTask, but having it separate
// makes it reusable with the repeating poll
function* serversTask(action) {
  try {
    const response = yield call(jupyterhub.getUser, action.payload);
    // parse response
    const serverkeys = Object.keys(response.data.servers).sort();
    const servers = serverkeys.map(key => response.data.servers[key]);
    // update server list
    yield put(actions.serversSucceeded(servers));
  } catch (error) {
    yield put(actions.serversFailed(error));
  }
}

function* serversPollTask(action) {
  while (true) {
    try {
      // fetch servers list
      yield call(serversTask, action);
      // wait 10 secconds and start over
      yield call(delay, 10000);
    } catch (error) {
      console.log('servers poll task failed. keep retrying', error);
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
    console.log('servers watch stop task failed.', error);
  }
}

export default function* computeSaga() {
  // start yourself
  // kick off servers list task, on restart it will cancel already running tasks
  yield takeLatest(actions.SERVERS_LIST_START, serversWatchStopTask);
}
