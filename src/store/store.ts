/**
 * File: src/store/store.ts
 * Purpose: Central Redux store configuration.
 * * This file acts as the single source of truth for the application state. 
 * It combines all slice reducers (users, questions, authedUser) into a 
 * root reducer and applies custom middleware like the logger.
 * * It also exports critical types (RootState and AppDispatch) used by 
 * the custom hooks in 'src/store/hooks.ts' to ensure type safety.
 */

import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/usersSlice';
import questionsReducer from '../slices/questionsSlice';
// Reducer for the currently authenticated user
import authedUserReducer from '../slices/authedUserSlice';
import logger from './middleware/logger';

/**
 * The Redux store instance. 
 */
export const store = configureStore({
  reducer: {
    users: usersReducer,
    questions: questionsReducer,
    authedUser: authedUserReducer,
  },
  // Adding the custom logger middleware to the default middleware stack
  // getDefaultMiddleware handles the Thunk and Serializability checks automatically
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(logger),
});

/**
 * Infer the `RootState` and `AppDispatch` types from the store itself.
 * These are exported to be consumed by typed hooks in hooks.ts.
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;