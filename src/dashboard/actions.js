
import { action } from '../utils';

export const FEED_FETCH = 'FEED/FETCH';
export const FEED_SUCCEEDED = 'FEED/SUCCEEDED';
export const FEED_FAILED = 'FEED/FAILED';

export const feedFetch = action(FEED_FETCH);
export const feedSucceeded = action(FEED_SUCCEEDED);
export const feedFailed = action(FEED_FAILED, true);
