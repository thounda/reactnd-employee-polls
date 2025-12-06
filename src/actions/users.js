/**
 * File: src/actions/users.js
 * Description: Action creators for managing the state of application users.
 * Includes helpers for updating user records when new questions or answers are saved.
 */

// Action Types
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const ADD_QUESTION_TO_USER = 'ADD_QUESTION_TO_USER';
export const ADD_ANSWER_TO_USER = 'ADD_ANSWER_TO_USER';

// Action Creators (Synchronous)

/**
 * @description Creates an action to receive the initial list of users.
 * This is used by the handleInitialData thunk.
 * @param {Object} users - Object mapping user IDs to user objects.
 * @returns {{type: string, users: Object}}
 */
export function receiveUsers(users) {
  return {
    type: RECEIVE_USERS,
    users,
  };
}

// Internal Helper Action Creators (Used by questions.js thunks)

/**
 * @description Creates an action to add a new question ID to the list of questions
 * created by a specific user.
 * @param {Object} question - The newly created question object, containing { id, author }.
 * @returns {{type: string, id: string, author: string}}
 */
export function _addQuestionToUser({ id, author }) {
  return {
    type: ADD_QUESTION_TO_USER,
    id,
    author,
  };
}

/**
 * @description Creates an action to record a user's answer/vote to a specific question.
 * @param {Object} info - { authedUser, qid, answer }
 * @returns {{type: string, authedUser: string, qid: string, answer: string}}
 */
export function _addAnswerToUser({ authedUser, qid, answer }) {
  return {
    type: ADD_ANSWER_TO_USER,
    authedUser,
    qid,
    answer,
  };
}