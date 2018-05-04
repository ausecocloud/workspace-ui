import axios from 'axios';
import { CANCEL } from 'redux-saga';
import { getClientToken } from './keycloak';
import { getConfig } from '../config';


let client;

export function getHubUrl() {
  return getConfig('jupyterhub').url;
}

// FIXME: almost duplicate code
function getClient() {
  if (!client) {
    client = axios.create({
      baseURL: getHubUrl(),
    });
    // add auth interceptor
    client.interceptors.request.use(
      // Do something before request is sent
      config => getClientToken(getConfig('jupyterhub').client_id)
        .then((token) => {
          const newConfig = config;
          if (token) {
            newConfig.headers.Authorization = `Bearer ${token}`;
          }
          return newConfig;
        })
        .catch((error) => { console.log('Token refresh failed: ', error); throw error; }),
      // Do something with request error
      error => Promise.reject(error),
    );
  }
  return client;
}

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


export function getUser(username) {
  const { promise, cancel } = callAPI({ url: `hub/api/users/${username}` });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}
