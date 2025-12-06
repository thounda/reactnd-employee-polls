/**
 * File: src/reducers/users.js
 * Description: Reducer for managing all user records.
 * It handles receiving initial data, adding a new question ID to a user's list,
 * and recording a user's answer/vote.
 */
import {
  RECEIVE_USERS,
  ADD_QUESTION_TO_USER,
  ADD_ANSWER_TO_USER,
} from '../actions/users.js';

/**
 * @description The reducer function for the `users` slice of state.
 * @param {Object} state - The current state object mapping user IDs to user objects.
 * @param {Object} action - The dispatched Redux action.
 * @returns {Object} The new users state.
 */
export default function users(state = {}, action) {
  switch (action.type) {
    case RECEIVE_USERS:
      return {
        ...action.users,
      };

    case ADD_QUESTION_TO_USER:
      // Update the author's record to include the new question ID
      return {
        ...state,
        [action.author]: {
          ...state[action.author],
          questions: state[action.author].questions.concat([action.id]),
        },
      };

    case ADD_ANSWER_TO_USER:
      // Update the user's record to include the answer
      return {
        ...state,
        [action.authedUser]: {
          ...state[action.authedUser],
          answers: {
            ...state[action.authedUser].answers,
            [action.qid]: action.answer,
          },
        },
      };

    default:
      return state;
  }
}