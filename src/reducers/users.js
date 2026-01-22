/**
 * File: src/reducers/users.js
 * Description: Reducer for managing the 'users' slice of state, including 
 * synchronizing user data when questions are created or answered.
 */

import { RECEIVE_USERS, ADD_USER_QUESTION } from '../actions/users'; 
import { ADD_QUESTION_ANSWER } from '../actions/questions'; 

/**
 * Reducer function for the users slice of state.
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

    /**
     * Updates the user's 'answers' mapping when a question is answered.
     * This responds to a 'questions' action to maintain data integrity.
     */
    case ADD_QUESTION_ANSWER: {
      const { authedUser, qid, answer } = action;

      if (!state[authedUser]) {
        return state;
      }

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
    }

    /**
     * Appends a new question ID to the author's list of created questions.
     */
    case ADD_USER_QUESTION: {
      const { author, id } = action.question; 
      
      if (!state[author]) {
        return state;
      }
      
      return {
        ...state,
        [author]: {
          ...state[author],
          questions: state[author].questions.concat([id]),
        },
      };
    }

    default:
      return state;
  }
}