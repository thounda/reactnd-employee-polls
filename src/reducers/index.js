/**
 * File: src/reducers/index.js
 * Description: Combines all individual reducers into the root reducer for the Redux store.
 */
import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar'; // <-- CRITICAL: Import the loading bar reducer

// Import our custom reducers
import authedUser from './authedUser.js';
import users from './users.js';
import questions from './questions.js';

// Combine them into the root reducer
export default combineReducers({
  authedUser,
  users,
  questions,
  loadingBar: loadingBarReducer, // <-- CRITICAL: Include the loading bar reducer
});