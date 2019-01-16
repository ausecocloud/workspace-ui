import * as actions from './actions';
import dashboardReducer, * as dashboard from './dashboard/reducers';
import projectsReducer, * as projects from './projects/reducers';
import computeReducer, * as compute from './compute/reducers';
import snippetsReducer, * as snippets from './snippets/reducers';


function userReducer(state = { idTokenParsed: {}, authenticated: false }, action) {
  switch (action.type) {
    case actions.LOGIN_SUCCEEDED:
      return {
        idTokenParsed: action.payload.idTokenParsed,
        authenticated: action.payload.authenticated,
      };
    case actions.LOGIN_FAILED:
      return {
        idTokenParsed: {},
        authenticated: false,
      };
    case actions.LOGOUT_SUCCEEDED:
      return {
        idTokenParsed: {},
        authenticated: false,
      };
    default:
      return state;
  }
}

const rootReducers = {
  auth: userReducer,
  dashboard: dashboardReducer,
  projects: projectsReducer,
  compute: computeReducer,
  snippets: snippetsReducer,
};

export default rootReducers;

// redefine selectors to match our mapping in rootReducer
export const getFeed = state => dashboard.getFeed(state.dashboard);

export const getStats = state => projects.getStats(state.projects);

export const getContents = state => projects.getContents(state.projects);

export const getPath = state => projects.getPath(state.projects);

export const getUser = state => state.auth && state.auth.idTokenParsed;

export const getAuthenticated = state => state.auth && state.auth.authenticated;

export const getProfiles = state => compute.getProfiles(state.compute);

export const getFlavours = state => compute.getFlavours(state.compute);

export const getServers = state => compute.getServers(state.compute);

export const getAuthorizations = state => compute.getAuthorizations(state.compute);

export const getSelectedDistributions = state => snippets.getSelectedDistributions(state.snippets);
