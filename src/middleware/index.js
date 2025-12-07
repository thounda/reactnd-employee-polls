/**
 * File: src/middleware/index.js
 * Description: Combines all necessary Redux middleware (logger and thunk)
 * into a single enhancer used during store creation.
 */
import { applyMiddleware } from 'redux';
import logger from './logger.js';

// CRITICAL TEMPORARY BYPASS: We are replacing the problematic 'redux-thunk'
// import with a simple mock function that satisfies the 'middleware is a function'
// check, allowing the store to initialize.
const thunk = ({ dispatch, getState }) => next => action => {
  // If the action is a function, call it (this is the core thunk logic)
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  // Otherwise, just pass it to the next middleware/reducer
  return next(action);
};

// NOTE: We no longer import 'redux-thunk' which resolves the Uncaught SyntaxError.

/**
 * @description Creates the Redux store enhancer by applying all middleware.
 * Includes thunk for asynchronous actions and logger for debugging.
 */
export default applyMiddleware(
  thunk, // Using the mocked thunk function
  logger,
);