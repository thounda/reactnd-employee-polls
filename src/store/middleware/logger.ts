/**
 * File: src/store/middleware/logger.ts
 * Purpose: Custom Redux middleware for development logging with corrected TypeScript types.
 * * This version uses a more generic Middleware type to avoid circular references
 * with RootState during the store setup phase.
 */

import { Middleware } from '@reduxjs/toolkit';

/**
 * A custom logger middleware that logs the action type, the action payload,
 * and the resulting state after the reducer has processed the action.
 * * Using 'Middleware' without generic arguments avoids circular type dependencies
 * with the RootState defined in store.ts.
 */
const logger: Middleware = (store) => (next) => (action) => {
  // Check if this is a standard action with a type property
  if (typeof action === 'object' && action !== null && 'type' in action) {
    // Start a console group for better readability in the dev tools
    console.group((action as { type: string }).type);
    console.log('The action: ', action);
    
    // Pass the action to the next middleware or the reducer
    const returnValue = next(action);
    
    // Log the state after the update
    console.log('The new state: ', store.getState());
    console.groupEnd();
    
    return returnValue;
  }

  // Fallback for thunks, promises, or other non-standard actions 
  // that might be passing through the middleware chain
  return next(action);
};

export default logger;