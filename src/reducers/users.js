/**
 * File: src/reducers/users.js
 * Description: Reducer for the 'users' slice of state.
 */
import { RECEIVE_USERS } from '../actions/users.js'; // Assume this exists
import { ADD_ANSWER_TO_QUESTION } from '../actions/questions.js';

// Assume ADD_QUESTION_TO_USER exists for future implementation (New Poll)

/**
 * @description Reducer function for the users slice of state.
 * @param {Object} state - The current users object.
 * @param {Object} action - The Redux action.
 * @returns {Object} The new users state.
 */
export default function users(state = {}, action) {
  switch (action.type) {
    case RECEIVE_USERS:
      return {
        ...state,
        ...action.users,
      };

    case ADD_ANSWER_TO_QUESTION:
      const { authedUser, qid, answer } = action;

      return {
        ...state,
        [authedUser]: {
          ...state[authedUser],
          // Add the answer to the user's answers dictionary
          answers: {
            ...state[authedUser].answers,
            [qid]: answer,
          },
        },
      };

    default:
      return state;
  }
}