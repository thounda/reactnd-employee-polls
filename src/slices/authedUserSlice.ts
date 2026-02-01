/**
 * FILE: src/slices/authedUserSlice.ts
 * DESCRIPTION: 
 * Modern Redux Toolkit Slice for Authentication.
 * Replaces legacy action creators and reducers.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { AppDispatch } from '../store';
import { AuthedUserState } from './types';

// Initial state using the type defined in types.ts
const initialState: AuthedUserState = {
  value: null,
};

const authedUserSlice = createSlice({
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

// Export actions for use in components or thunks
export const { setAuthedUser, logoutAuthedUser } = authedUserSlice.actions;

/**
 * handleSetAuthedUser Thunk
 * Manages the asynchronous flow of logging in a user, including the loading bar.
 * This is used for login actions in the UI.
 */
export function handleSetAuthedUser(id: string) {
  return (dispatch: AppDispatch) => {
    // Standard Redux Loading Bar integration
    dispatch(showLoading());
    
    dispatch(setAuthedUser(id));
    
    dispatch(hideLoading());
  };
}

/**
 * handleLogout Thunk
 * Manages the flow for logging out.
 */
export function handleLogout() {
  return (dispatch: AppDispatch) => {
    dispatch(showLoading());
    dispatch(logoutAuthedUser());
    dispatch(hideLoading());
  };
}

// Export the reducer as default for store configuration
export default authedUserSlice.reducer;