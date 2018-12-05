
import axios from 'axios';
import { CANCEL } from 'redux-saga';
import { getKeycloak } from './keycloak';
import { getConfig } from '../config';

// TODO: think about keeping 'username' somewhere global or get it from state tree
//       instead of passing it down through every API call.
//       We need username to mint tokens if needed.

let client;

export function getTokensUrl() {
  return getConfig('tokens').url;
}


// FIXME: almost duplicate code
function getClient() {
  if (!client) {
    client = axios.create({
      baseURL: getTokensUrl(),
    });
    // add auth interceptor
    client.interceptors.request.use(
      (config) => {
        const kc = getKeycloak();
        return kc.updateToken()
          .then(() => {
            const newConfig = config;
            newConfig.headers.Authorization = `Bearer ${kc.token}`;
            return newConfig;
          })
          .catch((error) => {
            // console.log('Token refresh failed: ', error);
            throw error;
          });
      },
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


// /authorizations
// /<provider>/authorize
// /<provider>/revoke
// /<provider>/token

export function authorizations() {
  const { promise, cancel } = callAPI({ url: 'api/v1/authorizations' });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}

export function authorize(params) {
  const { provider, referer } = params;
  const { promise, cancel } = callAPI({
    url: `/api/v1/${provider}/authorize`,
    method: 'POST',
    data: { referer },
    // This api call set's a cookie, which we'll need for the redirect_uri to succeed
    withCredentials: true,
  });
  const location = promise.then(response => response.headers.location);
  location[CANCEL] = cancel;
  return location;
}

export function revoke(params) {
  const { provider } = params;
  const { promise, cancel } = callAPI({
    url: `/api/v1/${provider}/revoke`,
    method: 'POST',
  });
  promise[CANCEL] = cancel;
  return promise;
}

export function token(params) {
  const { provider } = params;
  const { promise, cancel } = callAPI({
    url: `/api/v1/${provider}/token`,
    method: 'GET',
  });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}
