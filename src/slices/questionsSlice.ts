/**
 * FILE: src/slices/questionsSlice.ts
 * DESCRIPTION: Manages the questions state and handles asynchronous thunks.
 * Leverages centralized types and handles vote/question logic with memoized selectors.
 */

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getInitialData, saveQuestion, saveQuestionAnswer } from '../utils/_DATA';
import { receiveUsers, addQuestionToUser, addAnswerToUser } from './usersSlice';
import { Question, QuestionsState, AnswerPayload, RootState } from './types';

const initialState: QuestionsState = {};

/**
 * THUNK: Initial Data Fetch
 * Coordinates the population of both users and questions slices on app load.
 */
export const handleInitialData = createAsyncThunk(
  'shared/initialData',
  async (_, { dispatch }) => {
    const data = await getInitialData() as { users: any, questions: QuestionsState };
    const { users, questions } = data;
    
    // Distribute data to respective slices
    dispatch(receiveUsers(users));
    return questions; 
  }
);

/**
 * THUNK: Save New Question
 */
export const handleAddQuestion = createAsyncThunk(
  'questions/addQuestion',
  async ({ optionOneText, optionTwoText }: { optionOneText: string; optionTwoText: string }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const authedUser = state.authedUser.value;

    if (!authedUser) throw new Error("User must be logged in to post a question.");
    
    const question = await saveQuestion({
      optionOneText,
      optionTwoText,
      author: authedUser,
    }) as Question;
    
    // Update users slice to include reference to this new question
    dispatch(addQuestionToUser({ authedUser, qid: question.id }));
    
    return question;
  }
);

/**
 * THUNK: Save Answer (Vote)
 */
export const handleAddAnswer = createAsyncThunk(
  'questions/addAnswer',
  async (payload: AnswerPayload, { dispatch }) => {
    // Persist to "DB"
    await saveQuestionAnswer(payload);
    
    // Synchronize the users slice
    dispatch(addAnswerToUser(payload));
    
    return payload;
  }
);

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    receiveQuestions(_state, action: PayloadAction<QuestionsState>) {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleInitialData.fulfilled, (_state, action) => {
        return action.payload;
      })
      .addCase(handleAddQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        state[action.payload.id] = action.payload;
      })
      .addCase(handleAddAnswer.fulfilled, (state, action: PayloadAction<AnswerPayload>) => {
        const { authedUser, qid, answer } = action.payload;
        if (state[qid]) {
          const optionVotes = state[qid][answer].votes;
          // Guard: Prevent duplicate votes in the state
          if (!optionVotes.includes(authedUser)) {
            optionVotes.push(authedUser);
          }
        }
      });
  }
});

// SELECTORS
export const selectQuestions = (state: RootState) => state.questions;
export const selectQuestionById = (state: RootState, id: string) => state.questions[id];

export const { receiveQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;