/**
 * File: src/store.ts
 * Description:
 * This file configures the Redux store for the Employee Polls application.
 * It integrates the reducers (to be defined) and exports the necessary 
 * types for TypeScript integration across the app.
 * * Note: While '@reduxjs/toolkit' may show a resolution error in the 
 * browser preview environment, it is correctly configured for your
 * local development environment with the necessary dependencies installed.
 */

import { configureStore } from '@reduxjs/toolkit';

// These reducers will be populated as slices are developed
// Example imports for future use:
// import authReducer from './features/auth/authSlice';
// import usersReducer from './features/users/usersSlice';
// import questionsReducer from './features/questions/questionsSlice';

export const store = configureStore({
  reducer: {
    // Current empty state for initial setup
    // auth: authReducer,
    // users: usersReducer,
    // questions: questionsReducer,
  },
});

/**
 * RootState:
 * Infers the state shape from the store itself. This is used by 
 * useAppSelector in src/hooks.ts to provide type safety for the state tree.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch:
 * Infers the dispatch type from the store. This allows useAppDispatch 
 * to handle thunks and standard actions with full type checking.
 */
export type AppDispatch = typeof store.dispatch;

export default store;