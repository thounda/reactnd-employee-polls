/**
 * File: src/store/middleware/logger.ts
 * Purpose: Custom Redux middleware for development logging with corrected TypeScript types.
 * * This version uses a more generic Middleware type to avoid circular references
 * with RootState during the store setup phase.
 */

import { Middleware } from '@reduxjs/toolkit';

// We use a generic Middleware type here. 
// If you need specific state types for logging logic, you can use 'any' 
// or a simplified version of your state to break the circular dependency.
const logger: Middleware = (store) => (next) => (action) => {
  // Check if this is a standard action with a type
  if (typeof action === 'object' && action !== null && 'type' in action) {
    console.group((action as { type: string }).type);
    console.log('The action: ', action);
    
    const returnValue = next(action);
    
    console.log('The new state: ', store.getState());
    console.groupEnd();
    
    return returnValue;
  }

  // Fallback for thunks or other non-standard actions
  return next(action);
};

export default logger;