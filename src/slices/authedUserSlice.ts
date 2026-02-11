/**
 * FILE: src/slices/authedUserSlice.ts
 * DESCRIPTION: Manages the authentication state. 
 * Coordinates with the loading bar for UI feedback during login/logout transitions.
 */

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { AuthedUserState, RootState } from './types';

const initialState: AuthedUserState = {
  value: null,
};

/**
 * THUNK: Handle Login
 * Wraps the auth change in loading bar actions for better UX.
 */
export const handleLogin = createAsyncThunk(
  'authedUser/login',
  async (id: string, { dispatch }) => {
    dispatch(showLoading());
    // In a real app, API auth logic would happen here.
    dispatch(setAuthedUser(id));
    dispatch(hideLoading());
    return id;
  }
);

/**
 * THUNK: Handle Logout
 */
export const handleLogout = createAsyncThunk(
  'authedUser/logout',
  async (_, { dispatch }) => {
    dispatch(showLoading());
    dispatch(logoutAuthedUser());
    dispatch(hideLoading());
  }
);

const authedUserSlice = createSlice({
  name: 'authedUser',
  initialState,
  reducers: {
    setAuthedUser: (state, action: PayloadAction<string | null>) => {
      state.value = action.payload;
    },
    logoutAuthedUser: (state) => {
      state.value = null;
    },
  },
});

// ACTIONS
export const { setAuthedUser, logoutAuthedUser } = authedUserSlice.actions;

// SELECTOR
/**
 * SELECTOR: Access the current user ID.
 * Usage: const authedUser = useSelector(selectAuthedUser);
 */
export const selectAuthedUser = (state: RootState) => state.authedUser.value;

export default authedUserSlice.reducer;