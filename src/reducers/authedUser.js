/**
 * File: src/reducers/authedUser.js
 * Description: Reducer for managing the ID of the currently logged-in user.
 * Handles setting the user upon login and clearing it upon logout.
 */
import {
  SET_AUTHED_USER,
  LOGOUT_AUTHED_USER
} from '../actions/authedUser.js';

/**
 * @description The reducer function for the `authedUser` slice of state.
 * @param {string | null} state - The current authenticated user ID, or null.
 * @param {Object} action - The dispatched Redux action.
 * @returns {string | null} The new authenticated user ID.
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