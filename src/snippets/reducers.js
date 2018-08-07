import { combineReducers } from 'redux';
import { Map } from 'immutable';
import * as actions from './actions';

/**
 * Reducer for `selectedDatasets`
 * @param {Map<string, object>} state
 * @param {object} action
 */
function selectedDatasets(state = Map(), action) {
  switch (action.type) {
    case actions.SNIPPET_SELECTION_ADD_DATASET: {
      /** Dataset to add */
      const dataset = action.payload;
      return state.set(dataset._id, dataset);
    }

    case actions.SNIPPET_SELECTION_DELETE_DATASET: {
      /** Dataset ID to remove */
      const datasetId = action.payload;
      return state.remove(datasetId);
    }

    default:
      return state;
  }
}

// export reducer as default ot be combined at unknown key at root level
const reducers = {
  selectedDatasets,
};

export default combineReducers(reducers);

// define selectors here as well, these should match the structure in
// combined reducer.
/** @param {typeof reducers} state */
export const getSelectedDatasets = state => state.selectedDatasets;
