/**
 * FILE: src/slices/authedUserSlice.ts
 * DESCRIPTION:
 * Implementation of the Authenticated User Slice using Redux Toolkit (RTK).
 * Manages the ID of the currently logged-in user.
 * CATEGORY: Architecture (RTK Implementation)
 */

import React from 'react';

// --- VS CODE PRODUCTION IMPORTS ---
// In your local environment, use: 
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

let createSlice: any;
try {
  const rtk = require('@reduxjs/toolkit');
  createSlice = rtk.createSlice;
} catch (e) {
  // Fallback for preview
}

// The state is simply the user ID string or null if not logged in
const initialState: string | null = null;

const authedUserSlice = (createSlice) ? createSlice({
  name: 'authedUser',
  initialState: initialState as string | null,
  reducers: {
    /**
     * Action: setAuthedUser
     * Purpose: Sets the ID of the user who just logged in.
     */
    setAuthedUser: (state: any, action: any) => {
      // Returning the payload replaces the primitive state
      return action.payload;
    },
    /**
     * Action: logoutAuthedUser
     * Purpose: Clears the authenticated user state.
     */
    logoutAuthedUser: () => {
      return null;
    },
  },
}) : { actions: {}, reducer: (s: any) => s };

export const { setAuthedUser, logoutAuthedUser } = authedUserSlice.actions;
export default authedUserSlice.reducer;

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">AuthedUser Slice</h2>
            <p className="text-xs text-slate-400 font-mono">src/slices/authedUserSlice.ts</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 uppercase mb-1">State Type</p>
            <p className="text-sm text-emerald-900">Primitive: <code className="font-mono">string | null</code></p>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              Action: <code className="bg-slate-100 px-1 rounded text-emerald-700">setAuthedUser</code>
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              Action: <code className="bg-slate-100 px-1 rounded text-emerald-700">logoutAuthedUser</code>
            </li>
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Architecture Category</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Slices: 100% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}