/**
 * FILE: src/slices/authedUserSlice.ts
 * DESCRIPTION:
 * Manages the currently authenticated user's ID.
 * Defaults to null if no user is logged in.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Define the state type - it's either a string (the user ID) or null
 */
type AuthedUserState = string | null;

const initialState: AuthedUserState = null;

const authedUserSlice = createSlice({
  name: 'authedUser',
  initialState: initialState as AuthedUserState,
  reducers: {
    /**
     * Action: setAuthedUser
     * Purpose: Sets the ID of the user currently logged into the application.
     */
    setAuthedUser: (_state, action: PayloadAction<string | null>) => {
      return action.payload;
    },
    /**
     * Action: logoutAuthedUser
     * Purpose: Clears the authenticated user state.
     */
    logoutAuthedUser: () => {
      return null;
    }
  }
});

// Named exports for actions
export const { setAuthedUser, logoutAuthedUser } = authedUserSlice.actions;

// Export the reducer as the default export
export default authedUserSlice.reducer;