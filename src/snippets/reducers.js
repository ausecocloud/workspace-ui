import { combineReducers } from 'redux';
import { Map } from 'immutable';
import * as actions from './actions';

/**
 * Reducer for `selectedDatasets`
 * @param {Map<string, object>} state
 * @param {object} action
 */
function selectedDistributions(state = Map(), action) {
  switch (action.type) {
    case actions.SNIPPET_SELECTION_ADD_DATASET: {
      /** Distribution to add */
      const dist = action.payload;
      return state.set(dist.identifier, dist);
    }

    case actions.SNIPPET_SELECTION_DELETE_DATASET: {
      /** Distribution ID to remove */
      const distId = action.payload;
      return state.remove(distId);
    }

    default:
      return state;
  }
}

// export reducer as default ot be combined at unknown key at root level
const reducers = {
  selectedDistributions,
};

export default combineReducers(reducers);

// define selectors here as well, these should match the structure in
// combined reducer.
/** @param {typeof reducers} state */
export const getSelectedDistributions = state => state.selectedDistributions;
