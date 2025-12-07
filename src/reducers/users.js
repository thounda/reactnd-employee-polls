/**
 * File: src/reducers/users.js
 * Description: Reducer for the users collection, handling updates when answers or new questions are created.
 */
import { 
  RECEIVE_USERS, 
  ADD_USER_ANSWER, 
  ADD_USER_QUESTION 
} from '../actions/users.js';

/**
 * @description Reducer function for the users slice of state.
 * @param {Object} state - The current users object.
 * @param {Object} action - The Redux action.
 * @returns {Object} The new users state.
 */
export default function users(state = {}, action) {
  switch (action.type) {
    case RECEIVE_USERS:
      // When receiving initial data, replace the state with the new users
      return {
        ...state,
        ...action.users,
      };

    case ADD_USER_ANSWER: { // Fix: Wrap with block scope
      // Action payload: { authedUser, qid, answer }
      const { authedUser, qid, answer } = action;

      return {
        ...state,
        [authedUser]: {
          ...state[authedUser],
          answers: {
            ...state[authedUser].answers,
            [qid]: answer, // Add the new answer to the user's answers map
          },
        },
      };
    } // Fix: Close block scope

    case ADD_USER_QUESTION: { // Fix: Wrap with block scope
      // Action payload: { question: { id, author, ... } }
      const { question } = action;

      return {
        ...state,
        [question.author]: {
          ...state[question.author],
          questions: state[question.author].questions.concat([question.id]), // Add the new question ID to the author's list
        },
      };
    } // Fix: Close block scope

    default:
      return state;
  }
}