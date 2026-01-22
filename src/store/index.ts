/**
 * FILE: src/store/index.ts
 * DESCRIPTION:
 * Entry point for the store directory. Exports the store instance and 
 * custom hooks for typed Dispatch and Selector.
 * CATEGORY: Architecture (RTK Implementation)
 */

import React from 'react';
// In VS Code, these are your primary exports:
// export * from './store';
// export * from './hooks'; 

/**
 * CUSTOM HOOKS (Standard RTK Pattern)
 * These ensure that every time you use a selector or dispatch an action,
 * the app knows exactly what data types to expect without manual casting.
 */

// --- VS CODE PRODUCTION IMPORTS ---
/* import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
*/

// --- PREVIEW ENVIRONMENT MOCKS ---
export const useAppDispatch = () => (action: any) => console.log("Dispatching:", action);
export const useAppSelector = (fn: any) => ({});

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6 border-b pb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">
            TS
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Architecture: Typed Hooks</h1>
            <p className="text-slate-500 text-sm italic">
              Path: <code className="bg-slate-100 px-1 rounded text-indigo-600">src/store/index.ts</code>
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-1">i</div>
            <div>
              <h3 className="font-bold text-slate-700">The "Hooks" Pattern</h3>
              <p className="text-sm text-slate-500">
                Instead of using standard <code className="font-mono text-pink-600">useDispatch</code>, we use <code className="font-mono text-indigo-600">useAppDispatch</code>. 
                This provides automatic intellisense for all our Thunks and Actions.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-xs text-slate-600 space-y-1">
            <p className="text-slate-400 font-italic">// Usage in Components:</p>
            <p className="text-indigo-600">const dispatch = useAppDispatch();</p>
            <p className="text-indigo-600">
              const users = useAppSelector(state {'=>'} state.users);
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-sm text-green-700">
              <strong>Verification:</strong> The <code className="font-mono text-xs">src/store/</code> directory is now structurally complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}