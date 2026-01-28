/**
 * FILE: src/store/store.ts
 * DESCRIPTION:
 * Configures the Redux store by combining the slices and applying middleware.
 * This is the central hub for the application's state management.
 */

import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/usersSlice';
import questionsReducer from '../slices/questionsSlice';
import authedUserReducer from '../slices/authedUserSlice';
import logger from './middleware/logger';

/**
 * Configure the store with the combined reducers and middleware.
 * We include the default middleware and append our custom logger.
 */
export const store = configureStore({
  reducer: {
    users: usersReducer,
    questions: questionsReducer,
    authedUser: authedUserReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;