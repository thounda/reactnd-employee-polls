/**
 * File: src/actions/questions.js
 * Description: Action creators and Thunks for questions (loading, adding new, and voting).
 */
import { saveQuestion, saveQuestionAnswer } from '../utils/api.js';
import { addUserQuestion, addUserAnswer } from './users.js';

// Action Types
export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS';
export const ADD_QUESTION = 'ADD_QUESTION';
export const ADD_QUESTION_ANSWER = 'ADD_QUESTION_ANSWER'; // Action type for voting

// -----------------------------------------------------------------------------
// Action Creators
// -----------------------------------------------------------------------------

export function receiveQuestions(questions) {
  return {
    type: RECEIVE_QUESTIONS,
    questions,
  };
}

/**
 * Action creator for adding a new question to the store.
 * (Used by handleAddQuestion thunk)
 */
function addQuestion(question) {
  return {
    type: ADD_QUESTION,
    question,
  };
}

/**
 * Action creator for recording a user's answer in the questions slice of state.
 * (Used by handleAddAnswer thunk)
 */
function addQuestionAnswer({ authedUser, qid, answer }) {
  return {
    type: ADD_QUESTION_ANSWER,
    authedUser,
    qid,
    answer,
  };
}

// -----------------------------------------------------------------------------
// Thunks
// -----------------------------------------------------------------------------

/**
 * ASYNC THUNK: Handles saving a new question to the API and updating the Redux store.
 */
export function handleAddQuestion(optionOneText, optionTwoText) {
  return (dispatch, getState) => {
    const { authedUser } = getState();

    const question = {
      optionOneText,
      optionTwoText,
      author: authedUser,
    };

    return saveQuestion(question)
      .then((formattedQuestion) => {
        dispatch(addQuestion(formattedQuestion));
        dispatch(addUserQuestion(formattedQuestion));
      })
      .catch((error) => {
        console.error('Error in handleAddQuestion:', error);
        alert('There was an error saving your new poll. Please try again.');
      });
  };
}

/**
 * ASYNC THUNK: Handles saving an answer to the API and updating the Redux store.
 * This is the crucial function that was likely missing before.
 */
export function handleAddAnswer(qid, answer) {
  return (dispatch, getState) => {
    const { authedUser } = getState();
    
    const info = {
      authedUser,
      qid,
      answer,
    };

    // Optimistically dispatch updates to the store
    dispatch(addQuestionAnswer(info));
    dispatch(addUserAnswer(info));

    return saveQuestionAnswer(info)
      .catch((error) => {
        console.error('Error in handleAddAnswer:', error);
        alert('There was an error submitting your vote. Please try again.');
      });
  };
}