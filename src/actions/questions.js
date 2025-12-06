/**
 * File: src/actions/questions.js
 * Description: Action creators and asynchronous thunks for managing the state of poll questions.
 */
import { saveQuestion, saveQuestionAnswer } from '../utils/api.js';
import { _addQuestionToUser, _addAnswerToUser } from './users.js'; // Dependency on user actions

// Action Types
export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS';
export const ADD_QUESTION = 'ADD_QUESTION';
export const ADD_ANSWER = 'ADD_ANSWER';

// Action Creators (Synchronous)

/**
 * @description Creates an action to receive the initial list of questions.
 * @param {Object} questions - Object mapping question IDs to question objects.
 * @returns {{type: string, questions: Object}}
 */
export function receiveQuestions(questions) {
  return {
    type: RECEIVE_QUESTIONS,
    questions,
  };
}

/**
 * @description Creates an action to add a newly created question to the Redux store.
 * @param {Object} question - The newly created question object.
 * @returns {{type: string, question: Object}}
 */
function addQuestion(question) {
  return {
    type: ADD_QUESTION,
    question,
  };
}

/**
 * @description Creates an action to record a user's answer/vote to a specific question.
 * @param {string} authedUser - The ID of the authenticated user.
 * @param {string} qid - The ID of the question being answered.
 * @param {string} answer - 'optionOne' or 'optionTwo'.
 * @returns {{type: string, authedUser: string, qid: string, answer: string}}
 */
function addAnswer({ authedUser, qid, answer }) {
  return {
    type: ADD_ANSWER,
    authedUser,
    qid,
    answer,
  };
}


// Thunk Action Creators (Asynchronous)

/**
 * @description Handles saving a new question to the API and updates both the questions
 * and users state in the Redux store upon success.
 * @param {string} optionOneText
 * @param {string} optionTwoText
 * @param {string} author - The ID of the author.
 * @returns {function} A thunk function.
 */
export function handleAddQuestion(optionOneText, optionTwoText, author) {
  return (dispatch) => {
    // Optimistic UI updates or loading indicator dispatch could go here
    return saveQuestion({ optionOneText, optionTwoText, author })
      .then((question) => {
        // 1. Update questions state
        dispatch(addQuestion(question));
        
        // 2. Update users state (add the new question ID to the user's list)
        dispatch(_addQuestionToUser(question));
      })
      .catch((error) => {
        console.error('Error in handleAddQuestion: ', error);
        alert('There was an error saving the new question. Please try again.');
        // Revert question addition or display error message
      });
  };
}

/**
 * @description Handles saving a user's answer/vote to the API and updates both the
 * questions and users state in the Redux store upon success.
 * @param {Object} info - { authedUser, qid, answer }
 * @returns {function} A thunk function.
 */
export function handleAddAnswer(info) {
  return (dispatch) => {
    // Optimistic UI updates or loading indicator dispatch could go here
    dispatch(addAnswer(info));
    dispatch(_addAnswerToUser(info));

    return saveQuestionAnswer(info)
      .catch((error) => {
        console.error('Error in handleAddAnswer: ', error);
        // If API call fails, we would ideally dispatch a rollback action here
        // For now, we just log the error and notify the user
        alert('There was an error saving your vote. Please refresh and try again.');
      });
  };
}