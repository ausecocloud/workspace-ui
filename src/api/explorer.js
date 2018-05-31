import axios from 'axios';
import { CANCEL } from 'redux-saga';

const KNurl = 'https://kn-v2-dev-es.oznome.csiro.au/datasets30/_search';

// FIXME: duplicate code
function callAPI(options) {
  // returns a cancelable promise
  const cancel = axios.CancelToken.source();
  const opts = {
    ...options,
    cancelToken: cancel.token,
  };
  const promise = getClient().request(opts);
  return { promise, cancel: cancel.cancel };
}


export function listFormats() {
  const { promise, cancel } = callAPI({ url: KNurl });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}

export function listPublishers(params) {
  const { promise, cancel } = callAPI({ url: KNurl });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}

