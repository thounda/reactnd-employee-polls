/**
 * FILE: src/slices/usersSlice.ts
 * DESCRIPTION: Manages the collection of users.
 * Handles the user-side of relational updates when questions are created or answered.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UsersState, AnswerPayload, RootState } from './types';

/**
 * Interface for the payload when a user creates a new question.
 */
interface AddQuestionToUserPayload {
  authedUser: string;
  qid: string;
}

const initialState: UsersState = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    /**
     * Populates the state with the users object retrieved from the API.
     */
    receiveUsers(_state, action: PayloadAction<UsersState>) {
      return action.payload;
    },

    /**
     * Updates a specific user's 'answers' object.
     * Logic: users[userId].answers[questionId] = 'optionOne' | 'optionTwo'
     */
    addAnswerToUser(state, action: PayloadAction<AnswerPayload>) {
      const { authedUser, qid, answer } = action.payload;
      const user = state[authedUser];
      if (user) {
        user.answers = {
          ...user.answers,
          [qid]: answer
        };
      }
    },

    /**
     * Appends a new question ID to a user's 'questions' array.
     */
    addQuestionToUser(state, action: PayloadAction<AddQuestionToUserPayload>) {
      const { authedUser, qid } = action.payload;
      const user = state[authedUser];
      if (user && !user.questions.includes(qid)) {
        user.questions.push(qid);
      }
    },
  },
});

// ACTIONS
export const { receiveUsers, addAnswerToUser, addQuestionToUser } = usersSlice.actions;

// SELECTORS
/**
 * SELECTOR: Returns the entire users object.
 */
export const selectUsers = (state: RootState) => state.users;

/**
 * SELECTOR: Returns a specific user by ID.
 */
export const selectUserById = (state: RootState, userId: string): User | undefined => 
  state.users[userId];

export default usersSlice.reducer;