/**
 * File: src/actions/questions.js
 * Description: Action creators and thunks for managing question data (fetching, adding, answering).
 */
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { _saveQuestionAnswer, _saveQuestion } from '../utils/_DATA.js'; // API helper

// Action Type Constants
export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS';
export const ADD_QUESTION = 'ADD_QUESTION';
export const ADD_ANSWER_TO_QUESTION = 'ADD_ANSWER_TO_QUESTION';
export const ADD_QUESTION_TO_USER = 'ADD_QUESTION_TO_USER'; // New: To update the user's list of created questions

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

export function addQuestion(question) {
  return {
    type: ADD_QUESTION,
    question,
  };
}

export function addQuestionToUser({ author, id }) {
  return {
    type: ADD_QUESTION_TO_USER,
    author,
    id,
  };
}


// -----------------------------------------------------------------------------
// Thunks
// -----------------------------------------------------------------------------

/**
 * Redux Thunk to handle saving a user's answer to a question.
 * (This is your existing, correct logic)
 */
export function handleSaveQuestionAnswer(authedUser, qid, answer) {
  return (dispatch) => {
    dispatch(showLoading());

    const answerInfo = { authedUser, qid, answer };

    dispatch(addAnswerToQuestion(answerInfo));

    return _saveQuestionAnswer(answerInfo)
      .then(() => {
        dispatch(hideLoading());
      })
      .catch((e) => {
        console.error('Error saving question answer: ', e);
        dispatch(hideLoading()); 
        console.error('There was an error submitting your answer. Please try again.', e); 
      });
  };
}


/**
 * Redux Thunk to handle creating and saving a new question (poll).
 * @param {string} optionOneText - Text for the first option.
 * @param {string} optionTwoText - Text for the second option.
 * @returns {Function} A Redux Thunk function.
 */
export function handleAddQuestion(optionOneText, optionTwoText) {
  return (dispatch, getState) => {
    const { authedUser } = getState();

    dispatch(showLoading());
    
    // Call the API to save the new question
    return _saveQuestion({
      optionOneText,
      optionTwoText,
      author: authedUser,
    })
      .then((question) => {
        // 1. Add the question to the global questions slice
        dispatch(addQuestion(question));
        // 2. Add the question ID to the user's created questions list
        dispatch(addQuestionToUser({ author: authedUser, id: question.id }));
        dispatch(hideLoading());
      })
      .catch((e) => {
        console.error('Error adding new question: ', e);
        dispatch(hideLoading());
        // Note: Using a custom modal/toast instead of alert() is better practice
        alert('There was an error creating the poll. Please try again.');
      });
  };
}