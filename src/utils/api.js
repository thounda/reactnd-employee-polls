/**
 * File: src/utils/api.js
 * Description: Wrapper for all API functions, primarily calling the mock database (_DATA.js).
 * This structure makes it easy to swap the mock API for a real backend later.
 */

// Import low-level mock database functions
import {
  _getUsers,
  _getQuestions,
  _saveQuestion,
  _saveQuestionAnswer
} from './_DATA.js';

/**
 * @description Fetches the initial data required to start the application:
 * the list of all users and the list of all questions.
 * @returns {Promise<Object>} An object containing users and questions.
 */
export function getInitialData() {
  // Use Promise.all to fetch both data sets in parallel
  return Promise.all([
    _getUsers(),
    _getQuestions(),
  ]).then(([users, questions]) => ({
    users,
    questions,
  }));
}

/**
 * @description Saves a new question to the database.
 * @param {Object} question - The question object to save.
 * @returns {Promise<Object>} The saved question object.
 */
export function saveQuestion(question) {
  return _saveQuestion(question);
}

/**
 * @description Saves a user's answer to a question.
 * @param {Object} info - { authedUser, qid, answer }
 * @returns {Promise<boolean>} True upon successful save.
 */
export function saveQuestionAnswer(info) {
  return _saveQuestionAnswer(info);
}