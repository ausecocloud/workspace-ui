import { combineReducers } from 'redux';
import * as actions from './actions';


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

function projectsReducer(state = {}, action) {
  switch (action.type) {
    case actions.PROJECTS_SUCCEEDED:
      return {
        ...state,
        projects: action.payload,
      };
    case actions.PROJECTS_FAILED:
      return {
        ...state,
        projects: [],
      };
    case actions.PROJECTS_SELECT:
      return {
        ...state,
        selected: action.payload,
      };
    default:
      return state;
  }
}

function contentsReducer(state = [], action) {
  switch (action.type) {
    case actions.CONTENTS_SUCCEEDED:
      return action.payload;
    case actions.CONTENTS_FAILED:
      return [];
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  projects: projectsReducer,
  contents: contentsReducer,
});

export default rootReducer;
