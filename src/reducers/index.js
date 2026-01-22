/**
 * File: src/reducers/index.js
 * Description: Combines all individual reducers into the root reducer for the Redux store.
 */
import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';

// Import our custom reducers
import authedUser from './authedUser';
import users from './users';
import questions from './questions';

/**
 * The root reducer combines all individual state slices.
 * loadingBar: tracks progress of asynchronous data fetching.
 * authedUser: tracks the currently logged-in user ID.
 * users: tracks all user objects and their metadata.
 * questions: tracks the poll data.
 */
export default combineReducers({
  authedUser,
  users,
  questions,
  loadingBar: loadingBarReducer,
});