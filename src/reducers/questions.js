/**
 * File: src/reducers/questions.js
 * Description: Reducer for the 'questions' slice of state. Manages the 
 * collection of polls and the voting logic within each option.
 */

import {
  RECEIVE_QUESTIONS,
  ADD_QUESTION,
  ADD_QUESTION_ANSWER, 
} from '../actions/questions';

/**
 * Reducer function for the questions slice of state.
 * @param {Object} state - The current questions object (normalized by ID).
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
      
    /**
     * Updates a specific question's option with a new vote.
     * Nesting level: State -> QuestionID -> Option (one/two) -> Votes Array.
     */
    case ADD_QUESTION_ANSWER: {
      const { qid, answer, authedUser } = action;
      
      // Defensive check: Ensure the question exists in state
      if (!state[qid]) {
        return state;
      }

      const question = state[qid];

      return {
        ...state,
        [qid]: {
          ...question,
          [answer]: {
            ...question[answer],
            // Add user ID to the votes array of the selected option
            votes: question[answer].votes.concat([authedUser]),
          },
        },
      };
    }

    /**
     * Adds a new question object to the state.
     */
    case ADD_QUESTION: {
      const { question } = action;
      
      return {
        ...state,
        [question.id]: question,
      };
    }
      
    default:
      return state;
  }
}