import ax from 'axios';
import { getClientToken } from './keycloak';


const axios = ax.create();

const hubUrl = 'http://localhost:8010';

// Add a request interceptor
axios.interceptors.request.use(
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


export function listServers(username) {
  return axios.get(`${hubUrl}/hub/api/users/${username}`)
    .then((response) => {
      const serverkeys = Object.keys(response.data.servers).sort();
      return serverkeys.map(key => response.data.servers[key]);
    });
}

export function getHubUrl() {
  return hubUrl;
}
