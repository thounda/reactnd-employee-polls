/**
 * FILE: src/slices/questionsSlice.ts
 * DESCRIPTION: Manages the questions state and handles asynchronous thunks.
 * Includes handleInitialData, handleAddQuestion, and handleAddAnswer.
 * Fixed TypeScript 'unknown' type assignment errors and optimized for local project.
 */

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
// Local imports - ensure these paths are correct in your VS Code environment
import { getInitialData, saveQuestion, saveQuestionAnswer } from '../utils/_DATA';
import { receiveUsers, addQuestionToUser, addAnswerToUser, UsersState } from './usersSlice';

/**
 * Interfaces
 */
export interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: { votes: string[]; text: string };
  optionTwo: { votes: string[]; text: string };
}

export interface QuestionsState {
  [key: string]: Question;
}

interface AnswerPayload {
  authedUser: string;
  qid: string;
  answer: 'optionOne' | 'optionTwo';
}

const initialState: QuestionsState = {};

/**
 * THUNK: Initial Data Fetch
 * Coordinates the population of both users and questions slices on app load.
 */
export const handleInitialData = createAsyncThunk(
  'shared/initialData',
  async (_, { dispatch }) => {
    // Cast the response from the mock API to resolve 'unknown' type errors
    const data = await getInitialData() as { users: UsersState, questions: QuestionsState };
    const { users, questions } = data;
    
    dispatch(receiveUsers(users));
    dispatch(questionsSlice.actions.receiveQuestions(questions));
  }
);

/**
 * THUNK: Save New Question
 */
export const handleAddQuestion = createAsyncThunk(
  'questions/addQuestion',
  async ({ optionOneText, optionTwoText }: { optionOneText: string; optionTwoText: string }, { getState, dispatch }) => {
    const state = getState() as any;
    const authedUser = state.authedUser.value;
    
    // Cast the returned question from the mock API to resolve type errors
    const question = await saveQuestion({
      optionOneText,
      optionTwoText,
      author: authedUser,
    }) as Question;
    
    dispatch(questionsSlice.actions.addQuestion(question));
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
    await saveQuestionAnswer(payload);
    dispatch(questionsSlice.actions.addAnswer(payload));
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
    addQuestion(state, action: PayloadAction<Question>) {
      state[action.payload.id] = action.payload;
    },
    addAnswer(state, action: PayloadAction<AnswerPayload>) {
      const { authedUser, qid, answer } = action.payload;
      if (state[qid]) {
        state[qid][answer].votes.push(authedUser);
      }
    },
  },
});

export const { receiveQuestions, addQuestion, addAnswer } = questionsSlice.actions;
export default questionsSlice.reducer;