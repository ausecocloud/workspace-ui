import * as actions from './actions';
import projectsReducer, * as projects from './projects/reducers';


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
  projects: projectsReducer,
};

export default rootReducers;

// redefine selectors to match our mapping in rootReducer
export const getProjects = state => projects.getProjects(state.projects);

export const getContents = state => projects.getContents(state.projects);

export const getSelected = state => projects.getSelected(state.projects);

export const getPath = state => projects.getPath(state.projects);

export const getUser = state => state.auth && state.auth.idTokenParsed;

export const getAuthenticated = state => state.auth && state.auth.authenticated;
