import axios from 'axios';
import { CANCEL } from 'redux-saga';
import { getClientToken } from './keycloak';
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
      // Do something before request is sent
      config => getClientToken(getConfig('workspace').client_id)
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


export function listProjects() {
  const { promise, cancel } = callAPI({ url: 'api/v1/projects' });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}

export function listContents(params) {
  const { promise, cancel } = callAPI({ url: 'api/v1/folders', params });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}

export function addFolder(params) {
  // project, path, name
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
  // project, path, files: FileList
  const data = new FormData();
  data.append('project', params.project);
  data.append('path', params.path);
  data.append('file', params.files[0]);

  const logProgress = progressEvent => console.log('Upload Progress', progressEvent, Math.round((progressEvent.loaded * 100) / progressEvent.total));
  const { promise, cancel } = callAPI({
    url: 'api/v1/files',
    method: 'POST',
    data,
    onUploadProgress: progress || logProgress,
  });
  promise[CANCEL] = cancel;
  return promise;
}

export function deleteFile(params) {
  // project, path, name
  const { promise, cancel } = callAPI({ url: 'api/v1/files', method: 'DELETE', params });
  promise[CANCEL] = cancel;
  return promise;
}

export function createProject(params) {
  const { promise, cancel } = callAPI({ url: 'api/v1/projects', method: 'POST', data: params });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}

export function getStats() {
  const { promise, cancel } = callAPI({ url: 'api/v1/stat', method: 'GET' });
  const data = promise.then(response => response.data);
  data[CANCEL] = cancel;
  return data;
}

