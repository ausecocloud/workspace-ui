
import { action } from '../utils';

export const PROFILES_FETCH = 'PROFILES/FETCH';
export const PROFILES_SUCCEEDED = 'PROFILES/SUCCEEDED';
export const PROFILES_FAILED = 'PROFILES/FAILED';

export const profilesFetch = action(PROFILES_FETCH);
export const profilesSucceeded = action(PROFILES_SUCCEEDED);
export const profilesFailed = action(PROFILES_FAILED);

export const SERVERS_LIST = 'SERVERS/LIST';
export const SERVERS_LIST_START = 'SERVERS/LIST/START';
export const SERVERS_LIST_STOP = 'SERVERS/LIST/STOP';
export const SERVERS_LIST_SUCCEEDED = 'SERVERS/LIST/SUCCEEDED';
export const SERVERS_LIST_FAILED = 'SERVERS/LIST/FAILED';

export const serversList = action(SERVERS_LIST);
export const serversListStart = action(SERVERS_LIST_START);
export const serversListStop = action(SERVERS_LIST_STOP);
export const serversSucceeded = action(SERVERS_LIST_SUCCEEDED);
export const serversFailed = action(SERVERS_LIST_FAILED, true);

export const SERVER_LAUNCH = 'SERVER/LAUNCH';
export const SERVER_LAUNCH_SUCCEEDED = 'SERVER/LAUNCH/SUCCEEDED';
export const SERVER_LAUNCH_FAILED = 'SERVER/LAUNCH/FAILED';

export const serverLaunch = action(SERVER_LAUNCH);
export const serverLaunchSucceeded = action(SERVER_LAUNCH_SUCCEEDED);
export const serverLaunchFailed = action(SERVER_LAUNCH_FAILED, true);

export const SERVER_TERMINATE = 'SERVER/TERMINATE';
export const SERVER_TERMINATE_SUCCEEDED = 'SERVER/TERMINATE/SUCCEEDED';
export const SERVER_TERMINATE_FAILED = 'SERVER/TERMINATE/FAILED';

export const serverTerminate = action(SERVER_TERMINATE);
export const serverTerminateSucceeded = action(SERVER_TERMINATE_SUCCEEDED);
export const serverTerminateFailed = action(SERVER_TERMINATE_FAILED);

export const TOKENS_AUTHORIZATIONS = 'TOKENS/AUTHORIZATIONS';
export const TOKENS_AUTHORIZATIONS_SUCCEEDED = 'TOKENS/AUTHORIZATIONS/SUCCEEDED';
export const TOKENS_AUTHORIZATIONS_FAILED = 'TOKENS/AUTHORIZATIONS/FAILED';

export const tokensAuthorizations = action(TOKENS_AUTHORIZATIONS);
export const tokensAuthorizationsSucceeded = action(TOKENS_AUTHORIZATIONS_SUCCEEDED);
export const tokensAuthorizationsFailed = action(TOKENS_AUTHORIZATIONS_FAILED);
