/**
 * File: src/middleware/index.js
 * Description: Combines all necessary Redux middleware (logger and thunk)
 * into a single enhancer used during store creation.
 */
import thunk from 'redux-thunk';
import logger from './logger.js';
import { applyMiddleware } from 'redux';

/**
 * @description Creates the Redux store enhancer by applying all middleware.
 * Includes thunk for asynchronous actions and logger for debugging.
 */
export default applyMiddleware(
  thunk,
  logger,
);