/**
 * FILE: src/slices/usersSlice.ts
 * DESCRIPTION: Manages user data. Interfaces have been moved to types.ts 
 * to resolve type mismatch errors in the questionsSlice.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Importing the shared types to ensure compatibility across the app
import { User, UsersState, AnswerPayload as UserAnswerPayload } from './types';

/**
 * Interface for the payload when a user creates a question
 * (Kept here as it's specific to user-question relationship logic)
 */
interface UserQuestionPayload {
  authedUser: string;
  qid: string;
}

const initialState: UsersState = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    /**
     * Initial data load from _DATA.ts
     */
    receiveUsers(_state, action: PayloadAction<UsersState>) {
      return action.payload;
    },
    /**
     * Updates the user's answers mapping.
     * Called by handleAddAnswer thunk in questionsSlice.
     */
    addAnswerToUser(state, action: PayloadAction<UserAnswerPayload>) {
      const { authedUser, qid, answer } = action.payload;
      if (state[authedUser]) {
        state[authedUser].answers[qid] = answer;
      }
    },
    /**
     * Adds a question ID to the user's created questions array.
     * Called by handleAddQuestion thunk in questionsSlice.
     */
    addQuestionToUser(state, action: PayloadAction<UserQuestionPayload>) {
      const { authedUser, qid } = action.payload;
      if (state[authedUser]) {
        // Ensure we don't add duplicates if the thunk retries
        if (!state[authedUser].questions.includes(qid)) {
          state[authedUser].questions.push(qid);
        }
      }
    },
  },
});

export const { receiveUsers, addAnswerToUser, addQuestionToUser } = usersSlice.actions;
export default usersSlice.reducer;