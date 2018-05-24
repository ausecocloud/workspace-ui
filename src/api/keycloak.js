// little wrapper around keycloak client.
// the problem is, that the keycloak client object stores state on itself.
// which means, that it is a mutable object and should not be stored in the
// redux state tree.
import axios from 'axios';
import Keycloak from 'keycloak-js';
import * as actions from '../actions';

let keycloak;

export function getKeycloak() {
  return keycloak;
}

function loadTokens() {
  try {
    const tokens = {};
    ['token', 'refreshToken', 'idToken'].forEach((key) => {
      const val = localStorage.getItem(key);
      // verify it is a JWT.
      if (val && val.split('.').length === 3) {
        tokens[key] = val;
      }
    });
    return tokens;
  } catch (error) {
    console.log("Can't load data from local storage", error);
  }
  return {};
}

function storeTokens(kc) {
  try {
    ['token', 'refreshToken', 'idToken'].forEach((key) => {
      const val = kc[key];
      if (val) {
        localStorage.setItem(key, val);
      } else {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.log("Can't persist data to local storage", error);
  }
}

export function initAuth(config, store) {
  // TODO: do a retry / backoff loop here ... until keycloak init succeeds (no error)
  //       or if moved into an init saga, do it there.
  keycloak = Keycloak(config);
  // setup token refresh
  keycloak.onTokenExpired = () => keycloak.updateToken()
    .then(refreshed => console.log('refresh on expire:', refreshed))
    .catch(error => console.log('refresh on expire failed', error));

  keycloak.onAuthSuccess = () => storeTokens(keycloak);
  keycloak.onAuthError = () => storeTokens(keycloak);
  keycloak.onAuthRefreshSuccess = () => storeTokens(keycloak);
  keycloak.onAuthRefreshError = () => storeTokens(keycloak);
  keycloak.onAuthLogout = () => store.dispatch(actions.logout());

  // init keycloak
  const tokens = loadTokens();
  // FIXME: in case our tokens are invalid, we can't really verify here,
  //        but we can at least check if the format is ok.
  //        unser some circumstance, keycloak.ini may fail in a way
  //        (e.g. no '.' in JWT trefresh oken), so that we can't detect an
  //        error here. (Exception is thrown async and passed to the browser).
  return keycloak.init({ onLoad: 'check-sso', ...tokens })
    .then(x => x && store.dispatch(actions.loginSucceeded(keycloak)))
    .catch(e => console.log('E KC:', e));
}


// TODO: there may be a migration problem between keycloak 3 and 4. It looks
//       like to scope to exchange tokens has been renamed from token-exchange (3)
//       to exchange'to (4) ... all permission / policies in ketcloak need to be updated
//       old scopes can be removed / cleaned up?
// TODO: file an issue with keycloak team about error 500 in keycloak 4 with token exchange...
//       maybe this token rename is the problem and should never have happened?

// A methods to retrieve a token for a different client (token exchange) from
// keycloak
// returns a promise
function fetchClientToken(clientid) {
  // 1. make sure our access token is valid:
  return keycloak.updateToken()
    // 2. exchange current token for client access token
    .then(() => {
      // token should be up to date, buld token exchange request
      // using URLSearchParams instructs axios to set content type correctly as well
      const params = new URLSearchParams();
      params.append('client_id', keycloak.clientId);
      params.append('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange');
      params.append('subject_token', keycloak.token);
      params.append('subject_issuer', keycloak.tokenParsed.iss);
      params.append('subject_token_type', 'urn:ietf:params:oauth:token-type:access_token');
      params.append('requested_token_type', 'urn:ietf:params:oauth:token-type:access_token');
      // refresh_token, id_token
      params.append('audience', clientid);
      return axios.post(
        // TODO: change in Keycloak 4
        // keycloak.endpoints.token(),
        keycloak.endpoints.token(),
        params,
        // {
        //   headers: {
        //     Authorization: `Bearer ${keycloak.token}`,
        //   },
        // },
      );
    })
    // 3. return token response
    .then(response => response.data);
}

// Storage cache for client tokens.
//    keys... client ids, values .. tokens
const tokenCache = {};
// methods:
//    add client token
//      maybe set up expiry callback
//    get client token
//      what if expired?... get a new one automatically?


export function getClientToken(clientid) {
  // returns a promise which resolves to access token
  // check store for valid token
  if (tokenCache[clientid]) {
    const { validUntil, response } = tokenCache[clientid];
    // we have some info for this clientid ... still valid?
    if ((new Date().getTime() / 1000) < validUntil) {
      // entry still valid ... return it
      return Promise.resolve(response.access_token);
    }
  }
  // we are still here, no valid token yet.
  // fetch a new token from token endpoint
  return fetchClientToken(clientid)
    .then((response) => {
      // we have a new token response, store it in cache
      const validUntil = ((new Date().getTime() / 1000) + response.expires_in) - keycloak.timeSkew;
      tokenCache[clientid] = {
        validUntil,
        response,
      };
      // return new token
      return response.access_token;
    });
}


export function updateUserAccount(formData) {
  // console.log(keycloak);
  // console.log(formData);
  keycloak.accountManagement();
  // TODO: reinstate this function with a proper call to a service
  // const { authServerUrl, realm, idTokenParsed } = keycloak;
  // const user = idTokenParsed.sub;
  // const url = `${authServerUrl}/${realm}/users/${user}`;
  // console.log(url);
  // return fetch(url, {
  //   method: 'PUT',
  //   body: formData,
  // })
  //   .then(response => response.json());
}


// init keycloak

// events:
//    onReady(authenticated)
//    onAuthSuccess
//    onAuthError
//    onAuthRefreshSuccess
//    onAuthRefreshError
//    onAuthLogout
//    onTokenExpired
