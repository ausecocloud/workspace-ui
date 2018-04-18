
import action from '../utils';


export const PROJECTS_LIST = 'PROJECTS/LIST';
export const PROJECTS_SELECT = 'PROJECTS/SELECT';
export const PROJECTS_SUCCEEDED = 'PROJECTS/SUCCEEDED';
export const PROJECTS_FAILED = 'PROJECTS/FAILED';

export const projectsList = action(PROJECTS_LIST);
export const projectsSelect = action(PROJECTS_SELECT);
export const projectsSucceeded = action(PROJECTS_SUCCEEDED);
export const projectsFailed = action(PROJECTS_FAILED, true);

export const CONTENTS_SUCCEEDED = 'CONTENTS/SUCCEEDED';
export const CONTENTS_FAILED = 'CONTENTS/FAILED';
export const CONTENTS_PATH = 'CONTENTS/PATH';

export const contentsSucceeded = action(CONTENTS_SUCCEEDED);
export const contentsFailed = action(CONTENTS_FAILED, true);
export const contentsPath = action(CONTENTS_PATH);
