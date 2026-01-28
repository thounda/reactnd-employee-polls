/**
 * FILE: src/reducers/index.ts
 * @description Combines all slice reducers into a single root reducer and exports state types.
 */

import { combineReducers } from '@reduxjs/toolkit';
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
const rootReducer = combineReducers({
  authedUser,
  users,
  questions,
  loadingBar: loadingBarReducer,
});

// Export the RootState type to be used throughout the app for typed selectors
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;