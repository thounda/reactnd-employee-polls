/**
 * FILE: src/slices/usersSlice.ts
 * DESCRIPTION:
 * Implementation of the Users Slice using Redux Toolkit (RTK).
 * Manages the collection of users fetched from the mock database.
 * CATEGORY: Architecture (RTK Implementation)
 */

import React from 'react';

// --- VS CODE PRODUCTION IMPORTS ---
// In your local environment, use: 
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { UsersState } from '../types';

let createSlice: any;
try {
  const rtk = require('@reduxjs/toolkit');
  createSlice = rtk.createSlice;
} catch (e) {
  // Fallback for preview environment
}

const initialState: any = {};

const usersSlice = (createSlice) ? createSlice({
  name: 'users',
  initialState,
  reducers: {
    /**
     * Action: receiveUsers
     * Purpose: Initializes or updates the users state with data from the API.
     */
    receiveUsers: (state: any, action: any) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    /**
     * Action: addAnswerToUser
     * Purpose: Updates a specific user's answers object when they vote on a poll.
     */
    addAnswerToUser: (state: any, action: any) => {
      const { authedUser, qid, answer } = action.payload;
      if (state[authedUser]) {
        state[authedUser].answers = {
          ...state[authedUser].answers,
          [qid]: answer,
        };
      }
    },
    /**
     * Action: addQuestionToUser
     * Purpose: Adds a new question ID to the 'questions' array of the user who created it.
     */
    addQuestionToUser: (state: any, action: any) => {
      const { authedUser, qid } = action.payload;
      if (state[authedUser]) {
        state[authedUser].questions = state[authedUser].questions.concat([qid]);
      }
    },
  },
}) : { actions: {}, reducer: (s: any) => s };

export const { receiveUsers, addAnswerToUser, addQuestionToUser } = usersSlice.actions;
export default usersSlice.reducer;

/**
 * PREVIEW COMPONENT
 * Tracking architectural progress.
 */
export function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Users Slice</h2>
            <p className="text-xs text-slate-400 font-mono">src/slices/usersSlice.ts</p>
          </div>
        </div>
        
        <ul className="space-y-3">
          <li className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            Action: <code className="bg-slate-100 px-1 rounded text-emerald-700">receiveUsers</code>
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            Action: <code className="bg-slate-100 px-1 rounded text-emerald-700">addAnswerToUser</code>
          </li>
          <li className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            Action: <code className="bg-slate-100 px-1 rounded text-emerald-700">addQuestionToUser</code>
          </li>
        </ul>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Status</p>
          <p className="text-sm text-emerald-600 font-medium">Ready for state integration</p>
        </div>
      </div>
    </div>
  );
}