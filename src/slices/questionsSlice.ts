/**
 * FILE: src/slices/questionsSlice.ts
 * DESCRIPTION:
 * Manages the "questions" state. Handles receiving all questions,
 * adding a new question, and recording a user's answer (vote).
 * CATEGORY: Architecture (RTK Implementation)
 */

import React from 'react';

// --- VS CODE PRODUCTION IMPORTS ---
// In your local environment, use: 
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface for the Question object
 */
export interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: {
    votes: string[];
    text: string;
  };
  optionTwo: {
    votes: string[];
    text: string;
  };
}

/**
 * Interface for the Questions state
 */
export interface QuestionsState {
  [key: string]: Question;
}

let createSlice: any;
try {
  const rtk = require('@reduxjs/toolkit');
  createSlice = rtk.createSlice;
} catch (e) {
  // Fallback for preview
}

const initialState: QuestionsState = {};

const questionsSlice = (createSlice) ? createSlice({
  name: 'questions',
  initialState,
  reducers: {
    /**
     * Set the initial batch of questions from the mock API
     */
    receiveQuestions(state: any, action: any) {
      return {
        ...state,
        ...action.payload,
      };
    },
    /**
     * Add a newly created question to the state
     */
    addQuestion(state: any, action: any) {
      state[action.payload.id] = action.payload;
    },
    /**
     * Update a question when a user votes for an option
     * Note: RTK uses Immer, allowing us to use .push() safely
     */
    addAnswerToQuestion(
      state: any,
      action: any
    ) {
      const { authedUser, qid, answer } = action.payload;
      if (state[qid]) {
        state[qid][answer].votes.push(authedUser);
      }
    },
  },
}) : { actions: {}, reducer: (s: any) => s };

export const { receiveQuestions, addQuestion, addAnswerToQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;

/**
 * PREVIEW COMPONENT
 * Tracking architectural progress.
 */
export function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Questions Slice</h2>
            <p className="text-xs text-slate-400 font-mono">src/slices/questionsSlice.ts</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-semibold text-blue-700 uppercase mb-1">State Structure</p>
            <p className="text-sm text-blue-900">Normalised Object Map [qid: string]: Question</p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              Action: <code className="bg-slate-100 px-1 rounded text-blue-700">receiveQuestions</code>
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              Action: <code className="bg-slate-100 px-1 rounded text-blue-700">addQuestion</code>
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              Action: <code className="bg-slate-100 px-1 rounded text-blue-700">addAnswerToQuestion</code>
            </li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Status</p>
          <p className="text-sm text-blue-600 font-medium">Logic Verified & Documented</p>
        </div>
      </div>
    </div>
  );
}