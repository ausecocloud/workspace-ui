import { combineReducers } from 'redux';
import * as actions from './actions';


function projects(state = [], action) {
  switch (action.type) {
    case actions.PROJECTS_SUCCEEDED:
      return action.payload;
    case actions.PROJECTS_FAILED:
      return [];
    default:
      return state;
  }
}

function selected(state = '', action) {
  switch (action.type) {
    case actions.PROJECTS_SELECT:
      return action.payload;
    default:
      return state;
  }
}


function contents(state = [], action) {
  switch (action.type) {
    case actions.CONTENTS_SUCCEEDED:
      return action.payload;
    case actions.CONTENTS_FAILED:
      return [];
    default:
      return state;
  }
}

function path(state = '/', action) {
  switch (action.type) {
    case actions.CONTENTS_PATH:
      return action.payload.path;
    default:
      return state;
  }
}


// export reducer as default ot be combined at unknown key at root level
export default combineReducers({
  projects,
  selected,
  contents,
  path,
});

// define selectors here as well, these should match the structure in
// combined reducer.
export const getProjects = state => state.projects;

export const getContents = state => state.contents;

export const getSelected = state => state.selected;

export const getPath = state => state.path;
