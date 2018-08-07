
import { action } from '../utils';

export const SNIPPET_SELECTION_ADD_DATASET = 'SNIPPET/SELECTION/ADD_DATASET';
export const SNIPPET_SELECTION_DELETE_DATASET = 'SNIPPET/SELECTION/DELETE_DATASET';
export const selectionAddDataset = action(SNIPPET_SELECTION_ADD_DATASET);
export const selectionDeleteDataset = action(SNIPPET_SELECTION_DELETE_DATASET);
