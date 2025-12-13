/**
 * File: src/actions/questions.js
 * Description: Action creators and thunks for managing question data (fetching, adding, answering).
 */
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { _saveQuestionAnswer } from '../utils/_DATA.js'; // API helper

// Action Type Constants
export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS';
export const ADD_QUESTION = 'ADD_QUESTION'; // For future use
export const ADD_ANSWER_TO_QUESTION = 'ADD_ANSWER_TO_QUESTION';

// -----------------------------------------------------------------------------
// Action Creators
// -----------------------------------------------------------------------------

export function receiveQuestions(questions) {
  return {
    type: RECEIVE_QUESTIONS,
    questions,
  };
}

export function addAnswerToQuestion({ authedUser, qid, answer }) {
  return {
    type: ADD_ANSWER_TO_QUESTION,
    authedUser,
    qid,
    answer,
  };
}

// -----------------------------------------------------------------------------
// Thunks
// -----------------------------------------------------------------------------

/**
 * Redux Thunk to handle saving a user's answer to a question.
 * @param {string} authedUser - The ID of the authenticated user.
 * @param {string} qid - The ID of the question being answered.
 * @param {string} answer - The user's choice ('optionOne' or 'optionTwo').
 * @returns {Function} A Redux Thunk function.
 */
export function handleSaveQuestionAnswer(authedUser, qid, answer) {
  return (dispatch) => {
    dispatch(showLoading());

    const answerInfo = { authedUser, qid, answer };

    // Optimistically update the store before the API call
    dispatch(addAnswerToQuestion(answerInfo));

    // Call the API to save the answer
    return _saveQuestionAnswer(answerInfo)
      .then(() => {
        dispatch(hideLoading());
      })
      .catch((e) => {
        console.error('Error saving question answer: ', e);
        
        // Log error and hide loading bar
        dispatch(hideLoading()); 
        // Note: Using a custom modal/toast instead of alert() is better practice
        console.error('There was an error submitting your answer. Please try again.', e); 
      });
  };
}