
import { action } from '../utils';

export const SERVERS_LIST = 'SERVERS/LIST';
export const SERVERS_LIST_START = 'SERVERS/LIST/START';
export const SERVERS_LIST_STOP = 'SERVERS/LIST/STOP';
export const SERVERS_SUCCEEDED = 'SERVERS/LIST/SUCCEEDED';
export const SERVERS_FAILED = 'SERVERS/LIST/FAILED';

export const serversList = action(SERVERS_LIST);
export const serversListStart = action(SERVERS_LIST_START);
export const serversListStop = action(SERVERS_LIST_STOP);
export const serversSucceeded = action(SERVERS_SUCCEEDED);
export const serversFailed = action(SERVERS_FAILED, true);
