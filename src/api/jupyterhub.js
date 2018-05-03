import axios from 'axios';
import { CANCEL } from 'redux-saga';
import { getClientToken } from './keycloak';
import { getConfig } from '../config';


const ajax = axios.create();

export function getHubUrl() {
  return getConfig('jupyterhub').url;
}

// Add a request interceptor
ajax.interceptors.request.use(
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

function doGet(url, options) {
  const cancel = axios.CancelToken.source();
  const opts = {
    ...options,
    cancelToken: cancel.token,
  };
  const promise = ajax.get(`${getHubUrl()}${url}`, opts);
  promise[CANCEL] = cancel.cancel;
  return promise;
}

export function getUser(username) {
  return doGet(`/hub/api/users/${username}`);
}
