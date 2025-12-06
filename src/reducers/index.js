/**
 * File: src/reducers/index.js
 * Description: The root reducer that combines all individual reducers (authedUser, users, questions).
 */
import { combineReducers } from 'redux';
import authedUser from './authedUser.js';
import users from './users.js';
import questions from './questions.js';

/**
 * @description Combines all individual reducers into a single root reducer.
 * The resulting state shape will be:
 * {
 * authedUser: 'user_id' | null,
 * users: { 'user_id': {...}, ... },
 * questions: { 'question_id': {...}, ... }
 * }
 */
export default combineReducers({
  authedUser,
  users,
  questions,
});