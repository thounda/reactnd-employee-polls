/**
 * File: src/actions/authedUser.js
 * Description: Action creators for setting and clearing the authenticated user (login/logout).
 */

export const SET_AUTHED_USER = 'SET_AUTHED_USER';
export const LOGOUT_AUTHED_USER = 'LOGOUT_AUTHED_USER';

/**
 * Action creator to set the currently authenticated user ID.
 * @param {string} id - The user ID.
 * @returns {Object} Redux action.
 */
export function setAuthedUser(id) {
  return {
    type: SET_AUTHED_USER,
    id,
  };
}

/**
 * Action creator to clear the currently authenticated user (logout).
 * @returns {Object} Redux action.
 */
export function logoutAuthedUser() {
  return {
    type: LOGOUT_AUTHED_USER,
  };
}