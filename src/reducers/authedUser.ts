/**
 * FILE: src/reducers/authedUser.ts
 * @description Reducer for managing the currently authenticated user state.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the state (null when not logged in)
type AuthedUserState = string | null;

const initialState: AuthedUserState = null;

const authedUserSlice = createSlice({
  name: 'authedUser',
  initialState,
  reducers: {
    /**
     * Set the current authenticated user ID.
     */
    setAuthedUser: (state, action: PayloadAction<string>) => {
      return action.payload;
    },
    /**
     * Clear the authenticated user (Logout).
     */
    logoutAuthedUser: () => {
      return null;
    },
  },
});

export const { setAuthedUser, logoutAuthedUser } = authedUserSlice.actions;
export default authedUserSlice.reducer;