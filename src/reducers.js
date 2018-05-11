import * as actions from './actions';
import projectsReducer, * as projects from './projects/reducers';
import computeReducer, * as compute from './compute/reducers';


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
  compute: computeReducer,
};

export default rootReducers;

// redefine selectors to match our mapping in rootReducer
export const getStats = state => projects.getStats(state.projects);

export const getProjects = state => projects.getProjects(state.projects);

export const getProject = (state, name) => {
  const projectsList = getProjects(state);
  for (let i = 0; i < projectsList.length; i += 1) {
    const project = projectsList[i];
    if (project.name === name) {
      return project;
    }
  }
  return null;
};

export const getContents = state => projects.getContents(state.projects);

export const getPath = state => projects.getPath(state.projects);

export const getUser = state => state.auth && state.auth.idTokenParsed;

export const getAuthenticated = state => state.auth && state.auth.authenticated;

export const getServers = state => compute.getServers(state.compute);
