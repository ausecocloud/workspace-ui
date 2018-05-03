import axios from 'axios';
import { CANCEL } from 'redux-saga';
import { getClientToken } from './keycloak';


const ajax = axios.create();

const hubUrl = 'http://localhost:8010';

// Add a request interceptor
ajax.interceptors.request.use(
  // Do something before request is sent
  config => getClientToken('jupyterhub')
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
  const promise = ajax.get(`${hubUrl}${url}`, opts);
  promise[CANCEL] = cancel.cancel;
  return promise;
}

export function getUser(username) {
  return doGet(`/hub/api/users/${username}`);
}

export function getHubUrl() {
  return hubUrl;
}
