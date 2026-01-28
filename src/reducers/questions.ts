/**
 * FILE: src/reducers/questions.ts
 * @description Reducer for managing the poll questions, including voting and creation.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape for a single option within a question
interface Option {
  votes: string[];
  text: string;
}

// Define the shape for a single question
interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: Option;
  optionTwo: Option;
}

// Define the shape of the questions state (normalized object)
interface QuestionsState {
  [questionId: string]: Question;
}

const initialState: QuestionsState = {};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    /**
     * Receives the initial questions data from the API.
     */
    receiveQuestions: (state, action: PayloadAction<QuestionsState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    /**
     * Adds a newly created question to the state.
     */
    addQuestion: (state, action: PayloadAction<Question>) => {
      state[action.payload.id] = action.payload;
    },
    /**
     * Records a user's vote by adding their ID to the specific option's votes array.
     */
    addQuestionAnswer: (
      state,
      action: PayloadAction<{ authedUser: string; qid: string; answer: 'optionOne' | 'optionTwo' }>
    ) => {
      const { authedUser, qid, answer } = action.payload;
      const question = state[qid];
      
      if (question) {
        // Add user ID to the votes array of the selected option
        question[answer].votes = question[answer].votes.concat([authedUser]);
      }
    },
  },
});

export const { receiveQuestions, addQuestion, addQuestionAnswer } = questionsSlice.actions;
export default questionsSlice.reducer;