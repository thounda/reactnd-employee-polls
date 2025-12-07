/**
 * File: src/actions/questions.js
 * Description: Action creators and Thunks for questions (fetching, adding, answering).
 */
import { saveQuestion, saveQuestionAnswer } from '../utils/api.js';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { addUserAnswer, addUserQuestion } from './users.js';

// Action Types
export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS';
export const ADD_QUESTION = 'ADD_QUESTION';
export const SAVE_QUESTION_ANSWER = 'SAVE_QUESTION_ANSWER'; // FIX: Removed invalid 'as const'

// Action creator definitions (Synchronous)

function addQuestion(question) {
  return {
    type: ADD_QUESTION,
    question,
  };
}

function recordQuestionAnswer({ authedUser, qid, answer }) {
  return {
    type: SAVE_QUESTION_ANSWER,
    authedUser,
    qid,
    answer,
  };
}

export function receiveQuestions(questions) {
  return {
    type: RECEIVE_QUESTIONS,
    questions,
  };
}


// --- THUNKS ---

/**
 * Thunk to handle adding a new question to the database and store.
 * @param {string} optionOneText - Text for the first option.
 * @param {string} optionTwoText - Text for the second option.
 * @returns {function} The thunk function.
 */
export function handleAddQuestion(optionOneText, optionTwoText) {
  return (dispatch, getState) => {
    const { authedUser } = getState();

    dispatch(showLoading());

    const question = {
      optionOneText,
      optionTwoText,
      author: authedUser,
    };

    return saveQuestion(question)
      .then((formattedQuestion) => {
        // Update both questions and users state
        dispatch(addQuestion(formattedQuestion));
        dispatch(addUserQuestion(formattedQuestion));
      })
      .catch((error) => {
        console.error('Error in handleAddQuestion:', error);
        throw error;
      })
      .finally(() => {
        dispatch(hideLoading());
      });
  };
}

/**
 * Thunk to handle a user submitting an answer to a question.
 * The component expects this to be exported as handleAddAnswer.
 * @param {string} qid - The ID of the question.
 * @param {string} answer - The user's choice ('optionOne' or 'optionTwo').
 * @returns {function} The thunk function.
 */
export function handleSaveQuestionAnswer(qid, answer) {
  return (dispatch, getState) => {
    const { authedUser } = getState();

    const info = { authedUser, qid, answer };

    // Optimistically update the store immediately before API call
    dispatch(recordQuestionAnswer(info));
    dispatch(addUserAnswer(info));

    dispatch(showLoading());

    return saveQuestionAnswer(info)
      .catch((error) => {
        console.error('Error in handleSaveQuestionAnswer:', error);
        console.error('Failed to save answer. Please refresh to reset state.');
        throw error; 
      })
      .finally(() => {
        dispatch(hideLoading());
      });
  };
}

// Export the function using the expected name as an alias for backward compatibility with components.
export { handleSaveQuestionAnswer as handleAddAnswer };