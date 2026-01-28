/**
 * FILE: src/store/middleware/logger.ts
 * DESCRIPTION:
 * Custom middleware that logs every action dispatched to the store
 * along with the state before and after the action is processed.
 */

import { Middleware } from '@reduxjs/toolkit';

/**
 * LOGGER MIDDLEWARE
 * This follows the standard Redux middleware signature: (store) => (next) => (action).
 * It provides colored console logs grouped by action type for easier debugging.
 */
const logger: Middleware = (store) => (next) => (action) => {
  // Check if this is a standard action object with a type
  if (typeof action !== 'object' || action === null || !('type' in action)) {
    return next(action);
  }

  // Group logs by action type. 
  // We check for groupCollapsed to keep the console tidy; fallback to group if needed.
  if (typeof console.groupCollapsed === 'function') {
    console.groupCollapsed(action.type as string);
  } else {
    console.group(action.type as string);
  }
  
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