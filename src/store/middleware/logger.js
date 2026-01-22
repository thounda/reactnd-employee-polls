/**
 * FILE: src/store/middleware/logger.ts
 * DESCRIPTION:
 * Custom middleware that logs every action dispatched to the store
 * along with the state before and after the action is processed.
 * CATEGORY: Architecture (Middleware)
 */

import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';

/**
 * LOGGER MIDDLEWARE
 * This follows the standard Redux middleware signature: (store) => (next) => (action).
 * It provides visibility into the state lifecycle during development.
 */
const logger: Middleware<{}, RootState> = (store) => (next) => (action) => {
  // Group logs by action type for better readability in the console
  console.group(action.type);
  
  // Log the current state before the action is applied
  console.log('%c prev state', 'color: #9E9E9E; font-weight: bold;', store.getState());
  
  // Log the action being dispatched
  console.log('%c action', 'color: #03A9F4; font-weight: bold;', action);

  // Pass the action to the next middleware or to the reducer
  const result = next(action);

  // Log the new state after the reducer has processed the action
  console.log('%c next state', 'color: #4CAF50; font-weight: bold;', store.getState());
  
  console.groupEnd();
  
  return result;
};

export default logger;