/**
 * File: src/reducers/users.js
 * Description: Reducer for the 'users' slice of state.
 */
import { RECEIVE_USERS } from '../actions/users.js'; 
import { ADD_ANSWER_TO_QUESTION, ADD_QUESTION_TO_USER } from '../actions/questions.js';

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
          answers: {
            ...state[authedUser].answers,
            [qid]: answer,
          },
        },
      };

    case ADD_QUESTION_TO_USER:
      const { author, id } = action;

      return {
        ...state,
        [author]: {
          ...state[author],
          // Add the new question ID to the user's questions array
          questions: state[author].questions.concat([id]),
        },
      };

    default:
      return state;
  }
}