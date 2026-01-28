/**
 * File: src/actions/authedUser.ts
 * Description: Action creators for setting and clearing the authenticated user (login/logout), 
 * and the thunk for handling the asynchronous setting of the user.
 * CATEGORY: Redux Actions / Auth Flow
 */

import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { AppDispatch } from '../store';

// Action Constants
export const SET_AUTHED_USER = 'SET_AUTHED_USER';
export const LOGOUT_AUTHED_USER = 'LOGOUT_AUTHED_USER';

/**
 * Action creator to set the currently authenticated user ID.
 * @param {string | null} id - The user ID.
 */
export function setAuthedUser(id: string | null) {
  return {
    type: SET_AUTHED_USER as typeof SET_AUTHED_USER,
    id,
  };
}

/**
 * Action creator to clear the currently authenticated user (logout).
 */
export function logoutAuthedUser() {
  return {
    type: LOGOUT_AUTHED_USER as typeof LOGOUT_AUTHED_USER,
  };
}

/**
 * Redux Thunk to handle setting the authenticated user.
 * This function handles the async flow and loading state.
 * @param {string} id - The user ID to set as authenticated.
 */
export function handleSetAuthedUser(id: string) {
  return (dispatch: AppDispatch) => {
    dispatch(showLoading());

    // Requirement: Set the authorized user.
    // In this app, we mock the login by just dispatching the ID.
    dispatch(setAuthedUser(id));

    dispatch(hideLoading());
  };
}

// Type definitions for the actions to be used in Reducers
export type AuthedUserActions = 
  | ReturnType<typeof setAuthedUser> 
  | ReturnType<typeof logoutAuthedUser>;