/**
 * FILE: src/slices/authedSlice.ts
 * DESCRIPTION: 
 * Modern Redux Toolkit Slice for Authentication.
 * This file replaces both the legacy action creators and the old reducer files.
 * * VS CODE INSTRUCTIONS:
 * This code is optimized for your local project. Ensure 'react-redux-loading-bar' 
 * and '@reduxjs/toolkit' are installed in your package.json.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// These imports are required for your local project
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { AppDispatch } from '../store';

interface AuthedUserState {
  value: string | null;
}

const initialState: AuthedUserState = {
  value: null,
};

const authedSlice = createSlice({
  name: 'authedUser',
  initialState,
  reducers: {
    /**
     * Sets the currently authenticated user ID.
     * Replaces the old SET_AUTHED_USER action constant.
     */
    setAuthedUser: (state, action: PayloadAction<string | null>) => {
      state.value = action.payload;
    },
    /**
     * Clears the authenticated user (Logout).
     * Replaces the old LOGOUT_AUTHED_USER action constant.
     */
    logoutAuthedUser: (state) => {
      state.value = null;
    },
  },
});

// Export the generated actions for use in components or thunks
export const { setAuthedUser, logoutAuthedUser } = authedSlice.actions;

/**
 * handleSetAuthedUser Thunk
 * Manages the asynchronous flow of logging in a user, including the loading bar.
 */
export function handleSetAuthedUser(id: string) {
  return (dispatch: AppDispatch) => {
    // Check if dispatch functions exist to avoid errors in different environments
    if (typeof showLoading === 'function') dispatch(showLoading());
    
    dispatch(setAuthedUser(id));
    
    if (typeof hideLoading === 'function') dispatch(hideLoading());
  };
}

// Export the reducer as default for the store configuration
export default authedSlice.reducer;