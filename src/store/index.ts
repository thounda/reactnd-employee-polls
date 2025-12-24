/**
 * File: src/store/index.ts
 * Description: 
 * This file serves as the central Redux store configuration for the Employee Polls application.
 * It utilizes Redux Toolkit's `configureStore` and `createSlice` to manage global state 
 * for authenticated users, system users, and the poll questions. 
 * * Logic handled here includes:
 * 1. authedUser: Tracks the currently logged-in user's ID.
 * 2. users: Stores the user directory data retrieved from the backend.
 * 3. questions: Stores the poll data, including options and votes.
 * 4. TypeScript Exports: Provides `RootState` and `AppDispatch` types for type-safe 
 * hooks and selectors throughout the application.
 */

import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Users, Questions } from '../types';

// State interface for the entire application
interface AppState {
  users: Users;
  questions: Questions;
  authedUser: string | null;
}

// Initial state values
const initialState: AppState = {
  users: {},
  questions: {},
  authedUser: null,
};

/**
 * authedUserSlice:
 * Handles the authentication state, allowing a user to log in by setting 
 * their ID or log out by resetting the state to null.
 */
const authedUserSlice = createSlice({
  name: 'authedUser',
  initialState: null as string | null,
  reducers: {
    setAuthedUser: (state, action: PayloadAction<string | null>) => action.payload,
    logout: () => null,
  },
});

/**
 * usersSlice:
 * Manages the list of users. Action 'receiveUsers' is used to populate 
 * the store with data from the mock API.
 */
const usersSlice = createSlice({
  name: 'users',
  initialState: {} as Users,
  reducers: {
    receiveUsers: (state, action: PayloadAction<Users>) => action.payload,
  },
});

/**
 * questionsSlice:
 * Manages the poll questions. Action 'receiveQuestions' initializes 
 * the store with all existing poll data.
 */
const questionsSlice = createSlice({
  name: 'questions',
  initialState: {} as Questions,
  reducers: {
    receiveQuestions: (state, action: PayloadAction<Questions>) => action.payload,
  },
});

// Exporting actions for use in dispatching
export const { setAuthedUser, logout } = authedUserSlice.actions;
export const { receiveUsers } = usersSlice.actions;
export const { receiveQuestions } = questionsSlice.actions;

// Store configuration
const store = configureStore({
  reducer: {
    authedUser: authedUserSlice.reducer,
    users: usersSlice.reducer,
    questions: questionsSlice.reducer,
  },
});

/**
 * TypeScript Support:
 * RootState allows us to type the 'state' parameter in selectors,
 * resolving the "Parameter 'state' implicitly has an 'any' type" error.
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;