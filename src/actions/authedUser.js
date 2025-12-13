/**
 * File: src/actions/authedUser.js
 * Description: Action creators for setting and clearing the authenticated user (login/logout), 
 * and the thunk for handling the asynchronous setting of the user.
 */
import { showLoading, hideLoading } from 'react-redux-loading-bar';

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

/**
 * Redux Thunk to handle setting the authenticated user.
 * This function handles the async flow and loading state.
 * @param {string} id - The user ID to set as authenticated.
 * @returns {Function} A Redux Thunk function.
 */
export function handleSetAuthedUser(id) {
  return (dispatch) => {
    dispatch(showLoading());

    // In a real application, you might make an API call here.
    // Since we are mocking the login/logout, we just dispatch the action directly.
    dispatch(setAuthedUser(id));

    dispatch(hideLoading());
  };
}