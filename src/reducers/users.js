/**
 * File: src/reducers/users.js
 * Description: Reducer for the 'users' slice of state.
 */
// FIX 1: Import all user-related action types from the users actions file
import { RECEIVE_USERS, ADD_USER_ANSWER, ADD_USER_QUESTION } from '../actions/users.js'; 
// FIX 2: Only import question-related action types from the questions actions file (ADD_QUESTION_ANSWER is the new name for voting)
import { ADD_QUESTION_ANSWER } from '../actions/questions.js'; 

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

    // Case for when a user answers a question (dispatched from questions thunk)
    case ADD_QUESTION_ANSWER: 
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

    // Case for when a user creates a new question (dispatched from questions thunk)
    case ADD_USER_QUESTION: 
      // The payload structure matches the 'addUserQuestion' action creator
      const { author, id } = action.question; 
      
      return {
        ...state,
        [author]: {
          ...state[author],
          questions: state[author].questions.concat([id]),
        },
      };

    default:
      return state;
  }
}