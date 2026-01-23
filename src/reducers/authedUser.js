/**
 * File: src/reducers/authedUser.js
 * Description: Reducer for managing the authenticated user ID state.
 */
import {
  SET_AUTHED_USER,
  LOGOUT_AUTHED_USER,
} from '../actions/authedUser';

/**
 * Reducer function for the authedUser slice of state.
 * @param {string | null} state - The current authenticated user ID (null if not logged in).
 * @param {Object} action - The Redux action.
 * @returns {string | null} The new authedUser state.
 */
export default function authedUser(state = null, action) {
  switch (action.type) {
    case SET_AUTHED_USER:
      // Sets the state to the user ID provided in the action
      return action.id;
    case LOGOUT_AUTHED_USER:
      // Resets the state to null when the user logs out
      return null;
    default:
      return state;
  }
}