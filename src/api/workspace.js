import ax from 'axios';
import { getClientToken } from './keycloak';


const axios = ax.create();


// Add a request interceptor
axios.interceptors.request.use(
  // Do something before request is sent
  config => getClientToken('local')
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

export function listProjects() {
  return axios.get('/api/v1/projects')
    .then(response => response.data);
}

export function listContents(params) {
  return axios.get('/api/v1/folders', { params })
    .then(response => response.data);
}

export function addFolder(params) {
  // project, path, name
  const { folder, ...rest } = params;
  return axios.post(
    '/api/v1/folders',
    folder,
    { params: rest },
  // We get a NoContent 204 respoense here
  ).then(response => response);
}

export function deleteFolder(params) {
  return axios.delete('/api/v1/folders', { params });
}

export function uploadFile(params) {
  // project, path, files: FileList
  const url = new URL('/api/v1/files', document.baseURI);
  const data = new FormData();
  data.append('project', params.project);
  data.append('path', params.path);
  data.append('file', params.files[0]);
  const config = {
    onUploadProgress: progressEvent => (
      console.log('Upload Progress', progressEvent, Math.round((progressEvent.loaded * 100) / progressEvent.total))
    ),
  };
  return axios.post(url, data, config)
    .then(res => res.data);
}

export function deleteFile(params) {
  // project, path, name
  return axios.delete('/api/v1/files', { params });
}
