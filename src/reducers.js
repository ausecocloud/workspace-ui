import { combineReducers } from 'redux';
import * as actions from './actions';
import projectsReducer, * as projects from './projects/reducers';


function userReducer(state = {}, action) {
  switch (action.type) {
    case actions.TOKEN_SUCCEEDED:
      return action.payload;
    case actions.TOKEN_FAILED:
      return {};
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectsReducer,
});

export default rootReducer;

// redefine selectors to match our mapping in rootReducer
export const getProjects = state => projects.getProjects(state.projects);

export const getContents = state => projects.getContents(state.projects);

export const getSelected = state => projects.getSelected(state.projects);

export const getPath = state => projects.getPath(state.projects);

export const getUser = state => state.user;
