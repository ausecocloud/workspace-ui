import axios from 'axios';
import { CANCEL } from 'redux-saga';
import { getClientToken } from './keycloak';
import { getConfig } from '../config';


const ajax = axios.create();

export function getWorkspaceUrl() {
  return getConfig('workspace').url;
}

// Add a request interceptor
ajax.interceptors.request.use(
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


function doGet(url, options) {
  const cancel = axios.CancelToken.source();
  const opts = {
    ...options,
    cancelToken: cancel.token,
  };
  const promise = ajax.get(`${getWorkspaceUrl()}${url}`, opts);
  promise[CANCEL] = cancel.cancel;
  return promise;
}

function doPost(url, params, options) {
  const cancel = axios.CancelToken.source();
  const opts = {
    ...options,
    cancelToken: cancel.token,
  };
  const promise = ajax.post(`${getWorkspaceUrl()}${url}`, params, opts);
  promise[CANCEL] = cancel.cancel;
  return promise;
}

function doDelete(url, options) {
  const cancel = axios.CancelToken.source();
  const opts = {
    ...options,
    cancelToken: cancel.token,
  };
  const promise = ajax.delete(`${getWorkspaceUrl()}${url}`, opts);
  promise[CANCEL] = cancel.cancel;
  return promise;
}


export function listProjects() {
  return doGet('/api/v1/projects');
}

export function listContents(params) {
  return doGet('/api/v1/folders', { params });
}

export function addFolder(params) {
  // project, path, name
  const { folder, ...rest } = params;
  return doPost('/api/v1/folders', folder, { params: rest });
}

export function deleteFolder(params) {
  return doDelete('/api/v1/folders', { params });
}

export function uploadFile(params) {
  // project, path, files: FileList
  const data = new FormData();
  data.append('project', params.project);
  data.append('path', params.path);
  data.append('file', params.files[0]);
  const config = {
    onUploadProgress: progressEvent => (
      console.log('Upload Progress', progressEvent, Math.round((progressEvent.loaded * 100) / progressEvent.total))
    ),
  };
  return doPost('/api/v1/files', data, config);
}

export function deleteFile(params) {
  // project, path, name
  return doDelete('/api/v1/files', { params });
}

export function createProject(params) {
  return doPost('/api/v1/projects', params);
}

