/**
 * File: src/reducers/authedUser.js
 * Description: Reducer for the authenticated user ID.
 */
import {
  SET_AUTHED_USER,
  LOGOUT_AUTHED_USER,
} from '../actions/authedUser.js';

/**
 * @description Reducer function for the authedUser slice of state.
 * @param {string | null} state - The current authenticated user ID, defaults to null.
 * @param {Object} action - The Redux action.
 * @returns {string | null} The new authedUser state.
 */
export default function authedUser(state = null, action) {
  switch (action.type) {
    case SET_AUTHED_USER:
      return action.id;
    case LOGOUT_AUTHED_USER:
      return null;
    default:
      return state;
  }
}