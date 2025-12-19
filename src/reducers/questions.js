/**
 * File: src/reducers/questions.js
 * Description: Reducer for the 'questions' slice of state.
 */
import {
  RECEIVE_QUESTIONS,
  ADD_QUESTION,
  // FIX: Action type renamed to ADD_QUESTION_ANSWER
  ADD_QUESTION_ANSWER, 
} from '../actions/questions.js';

/**
 * @description Reducer function for the questions slice of state.
 * @param {Object} state - The current questions object.
 * @param {Object} action - The Redux action.
 * @returns {Object} The new questions state.
 */
export default function questions(state = {}, action) {
  switch (action.type) {
    case RECEIVE_QUESTIONS:
      return {
        ...state,
        ...action.questions,
      };
      
    // FIX: Updated case name to match the new action type
    case ADD_QUESTION_ANSWER:
      const { qid, answer, authedUser } = action;

      // Update the specific question object with the new vote
      return {
        ...state,
        [qid]: {
          ...state[qid],
          [answer]: {
            ...state[qid][answer],
            votes: state[qid][answer].votes.concat([authedUser]),
          },
        },
      };

    case ADD_QUESTION:
      // Add the newly created question object to the state, indexed by its ID
      return {
        ...state,
        [action.question.id]: action.question,
      };
      
    default:
      return state;
  }
}