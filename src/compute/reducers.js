import { combineReducers } from 'redux';
import * as actions from './actions';


function servers(state = [], action) {
  switch (action.type) {
    case actions.SERVERS_LIST_SUCCEEDED:
      return action.payload;
    case actions.SERVERS_LIST_FAILED:
      return [];
    default:
      return state;
  }
}

function profiles(state = [], action) {
  switch (action.type) {
    case actions.PROFILES_SUCCEEDED:
      return action.payload;
    case actions.PROFILES_FAILED:
      return [];
    default:
      return state;
  }
}

function authorizations(state = [], action) {
  switch (action.type) {
    case actions.TOKENS_AUTHORIZATIONS_SUCCEEDED:
      return action.payload;
    case actions.TOKENS_AUTHORIZATIONS_FAILED:
      return [];
    default:
      return state;
  }
}


// export reducer as default ot be combined at unknown key at root level
export default combineReducers({
  servers,
  profiles,
  authorizations,
});

// define selectors here as well, these should match the structure in
// combined reducer.
export const getServers = state => state.servers;
export const getProfiles = state => state.profiles;
export const getAuthorizations = state => state.authorizations;
