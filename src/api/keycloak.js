// little wrapper around keycloak client.
// the problem is, that the keycloak client object stores state on itself.
// which means, that it is a mutable object and should not be stored in the
// redux state tree.
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
    console.error("Can't load data from local storage", error);
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
    console.error("Can't persist data to local storage", error);
  }
}

export function initAuth(config, store) {
  // TODO: do a retry / backoff loop here ... until keycloak init succeeds (no error)
  //       or if moved into an init saga, do it there.
  keycloak = Keycloak(config);
  // setup token refresh
  keycloak.onTokenExpired = () => keycloak.updateToken()
    .then(refreshed => console.warn('refresh on expire:', refreshed))
    .catch(error => console.error('refresh on expire failed', error));

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
  return keycloak.init({ onLoad: 'check-sso', promiseType: 'native', ...tokens })
    .then(x => x && store.dispatch(actions.loginSucceeded(keycloak)))
    .catch(e => console.error('E KC:', e));
}


export function updateUserAccount() {
  keycloak.accountManagement();
}
