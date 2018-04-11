
function action(type, error = false) {
  return (payload, metadata) => ({
    type, payload, error, metadata,
  });
}

export const TOKEN_FETCH = 'TOKEN/FETCH';
export const TOKEN_SUCCEEDED = 'TOKEN/SUCCEEDED';
export const TOKEN_FAILED = 'TOKEN/FAILED';

export const tokenFetch = action(TOKEN_FETCH);
export const tokenSucceeded = action(TOKEN_SUCCEEDED);
export const tokenFailed = action(TOKEN_FAILED, true);

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

export const contentsSucceeded = action(CONTENTS_SUCCEEDED);
export const contentsFailed = action(CONTENTS_FAILED, true);
