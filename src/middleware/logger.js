/**
 * File: src/middleware/logger.js
 * Description: A simple Redux middleware that logs every action dispatched,
 * showing the state before and after the action is processed.
 */

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('The action: ', action);
  const result = next(action);
  console.log('The new state: ', store.getState());
  console.groupEnd();
  return result;
};

export default logger;