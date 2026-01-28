/**
 * FILE: src/slices/usersSlice.ts
 * DESCRIPTION:
 * Manages the "users" state. Handles receiving user data and 
 * updating user records when they create or answer questions.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface for an individual User object
 */
export interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: {
    [qid: string]: 'optionOne' | 'optionTwo';
  };
  questions: string[];
}

/**
 * Interface for the Users state object
 */
export interface UsersState {
  [key: string]: User;
}

/**
 * Interface for the payload when a user answers a question
 */
interface UserAnswerPayload {
  authedUser: string;
  qid: string;
  answer: 'optionOne' | 'optionTwo';
}

/**
 * Interface for the payload when a user creates a question
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
     * Set the initial batch of users fetched from the mock API.
     * We use Object.assign to merge or simply return the payload to replace state.
     */
    receiveUsers(_state, action: PayloadAction<UsersState>) {
      return action.payload;
    },
    /**
     * Update a user's local record to include their new answer.
     * RTK's Immer allows direct mutation of the state object.
     */
    addAnswerToUser(state, action: PayloadAction<UserAnswerPayload>) {
      const { authedUser, qid, answer } = action.payload;
      if (state[authedUser]) {
        state[authedUser].answers[qid] = answer;
      }
    },
    /**
     * Add a new question ID to the author's list of created questions.
     */
    addQuestionToUser(state, action: PayloadAction<UserQuestionPayload>) {
      const { authedUser, qid } = action.payload;
      if (state[authedUser]) {
        state[authedUser].questions.push(qid);
      }
    },
  },
});

export const { receiveUsers, addAnswerToUser, addQuestionToUser } = usersSlice.actions;
export default usersSlice.reducer;