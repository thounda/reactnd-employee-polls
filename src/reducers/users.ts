/**
 * FILE: src/reducers/users.ts
 * @description Reducer for managing the application's users data.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape for a single user's data
interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: { [questionId: string]: string };
  questions: string[];
}

// Define the shape of the users state (normalized object)
interface UsersState {
  [userId: string]: User;
}

const initialState: UsersState = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    /**
     * Receives the initial users data (usually from an API) and populates the state.
     */
    receiveUsers: (state, action: PayloadAction<UsersState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    /**
     * Updates a user's answers when they vote on a poll.
     */
    addUserAnswer: (
      state,
      action: PayloadAction<{ authedUser: string; qid: string; answer: string }>
    ) => {
      const { authedUser, qid, answer } = action.payload;
      if (state[authedUser]) {
        state[authedUser].answers = {
          ...state[authedUser].answers,
          [qid]: answer,
        };
      }
    },
    /**
     * Adds a question ID to the user's questions list when they create a new poll.
     */
    addUserQuestion: (
      state,
      action: PayloadAction<{ authedUser: string; qid: string }>
    ) => {
      const { authedUser, qid } = action.payload;
      if (state[authedUser]) {
        state[authedUser].questions = state[authedUser].questions.concat([qid]);
      }
    },
  },
});

export const { receiveUsers, addUserAnswer, addUserQuestion } = usersSlice.actions;
export default usersSlice.reducer;