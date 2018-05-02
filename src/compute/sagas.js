import { delay } from 'redux-saga';
import { call, put, race, take, takeLatest } from 'redux-saga/effects';
import { jupyterhub } from '../api';
import * as actions from './actions';


// fetch list of users servers
// this could have been moved into serversPollTask, but having it separate
// makes it reusable with the repeating poll
function* serversTask(action) {
  try {
    console.log('FETCH SERVERS', action);
    const servers = yield call(jupyterhub.listServers, action.payload);
    yield put(actions.serversSucceeded(servers));
  } catch (error) {
    yield put(actions.serversFailed(error));
  }
}

function* serversPollTask(action) {
  while (true) {
    console.log('CALL servers list', action);
    // fetch servers list
    yield call(serversTask, action);
    // wait 10 secconds and start over
    console.log('CALL servers list delay', action);
    yield call(delay, 10000);
  }
}

// keep fetching servers while polling is active
function* serversWatchStopTask(action) {
  console.log('START servers watch for stop', action);
  yield race([
    // start the serversPollTask... it will never stop
    call(serversPollTask, action),
    // in parallel wait for servers list stop event,
    // whne received it will cancel the poll task as well
    take(actions.SERVERS_LIST_STOP),
  ]);
}

export default function* computeSaga() {
  // start yourself
  // kick off servers list task, on restart it will cancel already running tasks
  yield takeLatest(actions.SERVERS_LIST_START, serversWatchStopTask);
}
