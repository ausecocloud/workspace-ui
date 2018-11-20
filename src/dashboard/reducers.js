import { combineReducers } from 'redux';
import * as actions from './actions';


function feed(state = [], action) {
  switch (action.type) {
    case actions.FEED_SUCCEEDED:
      return action.payload;
    case actions.FEED_FAILED:
      return [];
    default:
      return state;
  }
}

// export reducer as default ot be combined at unknown key at root level
export default combineReducers({
  feed,
});

// define selectors here as well, these should match the structure in
// combined reducer.
export const getFeed = state => state.feed;
