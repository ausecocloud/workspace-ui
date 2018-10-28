
import { action } from '../utils';

// TODO: things should probable be named WORKSPACE* in here

export const CONTENTS_SUCCEEDED = 'CONTENTS/SUCCEEDED';
export const CONTENTS_FAILED = 'CONTENTS/FAILED';
export const CONTENTS_PATH = 'CONTENTS/PATH';

export const contentsSucceeded = action(CONTENTS_SUCCEEDED);
export const contentsFailed = action(CONTENTS_FAILED, true);
export const contentsPath = action(CONTENTS_PATH);

export const FOLDER_ADD = 'CONTENTS/FOLDER/ADD';
export const FOLDER_ADD_SUCCEEDED = 'CONTENTS/FOLDER/ADD/SUCCEEDED';
export const FOLDER_ADD_FAILED = 'CONTENTS/FOLDER/ADD/FAILED';

export const addFolder = action(FOLDER_ADD);
export const addFolderSucceeded = action(FOLDER_ADD_SUCCEEDED);
export const addFolderFailed = action(FOLDER_ADD_FAILED, true);

export const FOLDER_DELETE = 'CONTENTS/FOLDER/DELETE';
export const FOLDER_DELETE_SUCCEEDED = 'CONTENTS/FOLDER/DELETE/SUCCEDED';
export const FOLDER_DELETE_FAILED = 'CONTENTS/FOLDER/DELETE/FAILED';

export const deleteFolder = action(FOLDER_DELETE);
export const deleteFolderSucceeded = action(FOLDER_DELETE_SUCCEEDED);
export const deleteFolderFailed = action(FOLDER_DELETE_FAILED, true);

export const FILE_UPLOAD = 'CONTENTS/FILE/UPLOAD';
export const FILE_UPLOAD_SUCCEEDED = 'CONTENTS/FILE/UPLOAD/SUCCEEDED';
export const FILE_UPLOAD_FAILED = 'CONTENTS/FILE/UPLOAD/FAILED';

export const uploadFile = action(FILE_UPLOAD);
export const uploadFileSucceeded = action(FILE_UPLOAD_SUCCEEDED);
export const uploadFileFailed = action(FILE_UPLOAD_FAILED);

export const FILE_DELETE = 'CONTENTS/FILE/DELETE';
export const FILE_DELETE_SUCCEEDED = 'CONTENTS/FILE/DELETE/SUCCEDED';
export const FILE_DELETE_FAILED = 'CONTENTS/FILE/DELETE/FAILED';

export const deleteFile = action(FILE_DELETE);
export const deleteFileSucceeded = action(FILE_DELETE_SUCCEEDED);
export const deleteFileFailed = action(FILE_DELETE_FAILED, true);

export const FILE_DOWNLOAD = 'CONTENTS/FILE/DOWNLOAD';

export const downloadFile = action(FILE_DOWNLOAD);

export const PROJECTS_STATS = 'PROJECTS/STATS';
export const PROJECTS_STATS_SUCCEEDED = 'PROJECTS/STATS/SUCCEEDED';
export const PROJECTS_STATS_FAILED = 'PROJECTS/STATS/FAILED';

export const getStats = action(PROJECTS_STATS);
export const getStatsSucceeded = action(PROJECTS_STATS_SUCCEEDED);
export const getStatsFailed = action(PROJECTS_STATS_FAILED, true);
