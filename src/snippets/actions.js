
import { action } from '../utils';

export const SNIPPET_SELECTION_ADD_DATASET = 'SNIPPET/SELECTION/ADD_DATASET';
export const SNIPPET_SELECTION_DELETE_DATASET = 'SNIPPET/SELECTION/DELETE_DATASET';
export const selectionAddDistribution = action(SNIPPET_SELECTION_ADD_DATASET);
export const selectionDeleteDistribution = action(SNIPPET_SELECTION_DELETE_DATASET);
