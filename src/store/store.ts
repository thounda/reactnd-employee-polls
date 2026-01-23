/**
 * FILE: src/store/store.ts
 * DESCRIPTION:
 * Central Redux store configuration.
 * Adjusted to handle strict typing for question creation and state updates.
 */

import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Importing the data layer from the utils folder
// @ts-ignore - Ignore potential resolution issues with .js extensions in some TS configs
import { 
  _getUsers, 
  _getQuestions, 
  _saveQuestion, 
  _saveQuestionAnswer 
} from '../utils/_DATA.js';

// --- Types ---
export interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: Record<string, 'optionOne' | 'optionTwo'>;
  questions: string[];
}

export interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: { votes: string[]; text: string };
  optionTwo: { votes: string[]; text: string };
}

interface AppState {
  users: Record<string, User>;
  questions: Record<string, Question>;
  authedUser: string | null;
  loading: boolean;
}

// --- Async Actions (Thunks) ---

export const fetchInitialData = createAsyncThunk('data/fetchInitial', async () => {
  const users = await _getUsers();
  const questions = await _getQuestions();
  return { users, questions };
});

export const handleSaveAnswer = createAsyncThunk(
  'data/saveAnswer',
  async ({ authedUser, qid, answer }: { authedUser: string; qid: string; answer: 'optionOne' | 'optionTwo' }) => {
    await _saveQuestionAnswer({ authedUser, qid, answer });
    return { authedUser, qid, answer };
  }
);

export const handleAddQuestion = createAsyncThunk(
  'data/addQuestion',
  async ({ optionOneText, optionTwoText, author }: { optionOneText: string; optionTwoText: string; author: string }) => {
    // _saveQuestion usually returns the formatted question object
    const question = await _saveQuestion({ optionOneText, optionTwoText, author });
    return question as Question;
  }
);

// --- Slice ---

const initialState: AppState = {
  users: {},
  questions: {},
  authedUser: null,
  loading: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuthedUser: (state, action: PayloadAction<string | null>) => {
      state.authedUser = action.payload;
    },
    logout: (state) => {
      state.authedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.questions = action.payload.questions;
        state.loading = false;
      })
      .addCase(handleSaveAnswer.fulfilled, (state, action) => {
        const { authedUser, qid, answer } = action.payload;
        if (state.questions[qid] && state.users[authedUser]) {
          state.questions[qid][answer].votes.push(authedUser);
          state.users[authedUser].answers[qid] = answer;
        }
      })
      .addCase(handleAddQuestion.fulfilled, (state, action) => {
        const question = action.payload;
        state.questions[question.id] = question;
        if (state.users[question.author]) {
          state.users[question.author].questions.push(question.id);
        }
      });
  },
});

export const { setAuthedUser, logout } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;