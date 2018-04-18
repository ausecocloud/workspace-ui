
import action from './utils';


export const TOKEN_FETCH = 'TOKEN/FETCH';
export const TOKEN_SUCCEEDED = 'TOKEN/SUCCEEDED';
export const TOKEN_FAILED = 'TOKEN/FAILED';

export const tokenFetch = action(TOKEN_FETCH);
export const tokenSucceeded = action(TOKEN_SUCCEEDED);
export const tokenFailed = action(TOKEN_FAILED, true);
