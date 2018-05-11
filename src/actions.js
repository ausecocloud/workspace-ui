
import { action } from './utils';


export const LOGIN = 'AUTH/LOGIN';
export const LOGIN_SUCCEEDED = 'AUTH/LOGIN/SUCCEEDED';
export const LOGIN_FAILED = 'AUTH/LOGIN/FAILED';

export const login = action(LOGIN);
export const loginSucceeded = action(LOGIN_SUCCEEDED);
export const loginFailed = action(LOGIN_FAILED, true);

export const LOGOUT = 'AUTH/LOGOUT';
export const LOGOUT_SUCCEEDED = 'AUTH/LOGOUT/SUCCEEDED';
export const LOGOUT_FAILED = 'AUTH/LOGOUT/FAILED';

export const logout = action(LOGOUT);
export const logoutSucceeded = action(LOGOUT_SUCCEEDED);
export const logoutFailed = action(LOGOUT_FAILED, true);
