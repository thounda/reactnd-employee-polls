/**
 * File: src/actions/users.js
 * Description: Action creators for users (loading and updating answers/questions).
 * These are used by other thunks (e.g., in questions.js) to update the users slice of state.
 */

export const RECEIVE_USERS = 'RECEIVE_USERS';
export const ADD_USER_ANSWER = 'ADD_USER_ANSWER';
export const ADD_USER_QUESTION = 'ADD_USER_QUESTION';

/**
 * Action creator to load all users into the store.
 * @param {Object} users - Map of user objects.
 * @returns {Object} Redux action.
 */
export function receiveUsers(users) {
  return {
    type: RECEIVE_USERS,
    users,
  };
}

/**
 * Action creator for adding a recorded answer to a user.
 * NOTE: The name is simplified to match the import in questions.js.
 * @param {Object} info - { authedUser, qid, answer }
 * @returns {Object} Redux action.
 */
export function addUserAnswer({ authedUser, qid, answer }) {
  return {
    type: ADD_USER_ANSWER,
    authedUser,
    qid,
    answer,
  };
}

/**
 * Action creator for adding a newly created question to the author's list.
 * NOTE: The name is simplified to match the import in questions.js.
 * @param {Object} question - The new question object.
 * @returns {Object} Redux action.
 */
export function addUserQuestion(question) {
  return {
    type: ADD_USER_QUESTION,
    // The question object contains the ID and the author, which are needed in the reducer
    question, 
  };
}