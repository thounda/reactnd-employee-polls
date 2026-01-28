import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { _saveQuestion } from '../utils/_DATA';

/**
 * FILE: src/slices/questionsSlice.ts
 * DESCRIPTION: 
 * Handles the state and async actions for poll questions.
 * UPDATED: Optimized module resolution for Redux Toolkit and utility paths.
 */

interface QuestionOption {
  votes: string[];
  text: string;
}

export interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: QuestionOption;
  optionTwo: QuestionOption;
}

interface QuestionsState {
  [id: string]: Question;
}

const initialState: QuestionsState = {};

/**
 * Async Thunk to handle saving a new question.
 * Communicates with the simulated backend in _DATA.ts.
 */
export const handleAddQuestion = createAsyncThunk(
  'questions/handleAddQuestion',
  async ({ optionOneText, optionTwoText, author }: { optionOneText: string; optionTwoText: string; author: string }) => {
    const question = await _saveQuestion({
      optionOneText,
      optionTwoText,
      author,
    });
    return question as Question;
  }
);

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    /**
     * Populates the state with initial data from the API
     */
    receiveQuestions(state, action: PayloadAction<QuestionsState>) {
      return { ...state, ...action.payload };
    },
    /**
     * Locally adds a vote to a specific question option
     */
    addQuestionAnswer(state, action: PayloadAction<{ authedUser: string; qid: string; answer: 'optionOne' | 'optionTwo' }>) {
      const { authedUser, qid, answer } = action.payload;
      if (state[qid]) {
        state[qid][answer].votes = state[qid][answer].votes.concat([authedUser]);
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(handleAddQuestion.fulfilled, (state, action) => {
      state[action.payload.id] = action.payload;
    });
  },
});

export const { receiveQuestions, addQuestionAnswer } = questionsSlice.actions;
export default questionsSlice.reducer;