import axios from 'axios';
import { CANCEL } from 'redux-saga';
import { getKeycloak } from './keycloak';
import { getConfig } from '../config';


let client;

export function getWorkspaceUrl() {
  return getConfig('workspace').url;
}

// FIXME: almost duplicate code
function getClient() {
  if (!client) {
    client = axios.create({
      baseURL: getWorkspaceUrl(),
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


export function listContents(params) {
  const { promise, cancel } = callAPI({ url: 'api/v1/folders', params });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}

export function addFolder(params) {
  // path, name
  const { folder, ...rest } = params;
  const { promise, cancel } = callAPI({
    url: '/api/v1/folders',
    method: 'POST',
    data: folder,
    params: rest,
  });
  promise[CANCEL] = cancel;
  return promise;
}

export function deleteFolder(params) {
  const { promise, cancel } = callAPI({ url: 'api/v1/folders', method: 'DELETE', params });
  promise[CANCEL] = cancel;
  return promise;
}

export function uploadFile(params, progress) {
  // path, files: FileList
  const query = {
    path: params.path.endsWith('/') ? `${params.path}${params.files[0].name}` : `${params.path}/${params.files[0].name}`,
  };

  // const logProgress = progressEvent => (
  //   console.log(
  //     'Upload Progress',
  //     progressEvent,
  //     Math.round((progressEvent.loaded * 100) / progressEvent.total),
  //   )
  // );
  const { promise, cancel } = callAPI({
    url: 'api/v1/files',
    method: 'POST',
    params: query,
    data: params.files[0],
    headers: {
      'Content-Type': params.files[0].type,
    },
    onUploadProgress: progress || null, // logProgress
  });
  promise[CANCEL] = cancel;
  return promise;
}

export function deleteFile(params) {
  // path, name
  const { promise, cancel } = callAPI({ url: 'api/v1/files', method: 'DELETE', params });
  promise[CANCEL] = cancel;
  return promise;
}

/**
 * @param {{ path: string, name: string }} params
 */
export function downloadFile(params) {
  const { promise, cancel } = callAPI({
    url: 'api/v1/files/tempurl',
    method: 'GET',
    responseType: 'json',
    params,
  });
  promise[CANCEL] = cancel;
  return promise;
}

export function getStats() {
  const { promise, cancel } = callAPI({ url: 'api/v1/stat', method: 'GET' });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}
