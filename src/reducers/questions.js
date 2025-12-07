/**
 * File: src/reducers/questions.js
 * Description: Reducer for managing all poll question records.
 * Handles receiving initial data, adding a new question, and recording votes (answers).
 */
import {
  RECEIVE_QUESTIONS,
  ADD_QUESTION,
  SAVE_QUESTION_ANSWER, // Corrected constant name
} from '../actions/questions.js';

/**
 * @description The reducer function for the `questions` slice of state.
 * @param {Object} state - The current state object mapping question IDs to question objects.
 * @param {Object} action - The dispatched Redux action.
 * @returns {Object} The new questions state.
 */
export default function questions(state = {}, action) {
  switch (action.type) {
    case RECEIVE_QUESTIONS:
      return {
        ...state,
        ...action.questions,
      };

    case ADD_QUESTION: {
      // Wrapped in curly braces to create a block scope for 'question'
      const {
        question
      } = action;
      return {
        ...state,
        [question.id]: question,
      };
    }

    case SAVE_QUESTION_ANSWER: { // Corrected constant name
      // Wrapped in curly braces to create a block scope for 'qid', 'authedUser', 'answer'
      const {
        qid,
        authedUser,
        answer
      } = action;
      
      // Deeply update the specific question object to record the vote
      return {
        ...state,
        [qid]: {
          ...state[qid],
          [answer]: {
            ...state[qid][answer],
            // Add the authenticated user ID to the votes array for the chosen option
            votes: state[qid][answer].votes.concat([authedUser]),
          },
        },
      };
    }

    default:
      return state;
  }
}