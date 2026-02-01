/**
 * FILE: NewQuestion.tsx
 * PATH: /src/components/NewQuestion.tsx
 * DESCRIPTION:
 * This component provides a form for authenticated users to create new polls.
 * It strictly utilizes Redux Toolkit (RTK) patterns, dispatching the async 
 * handleAddQuestion thunk to the store.
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// --- START: Redux Action & Type Imports ---
import { handleAddQuestion } from '../slices/questionsSlice';

/**
 * RootState and AppDispatch are essential for TS to recognize 
 * the async thunks dispatched via Redux Toolkit.
 */
import { AppDispatch, RootState } from '../store'; 
// --- END: Redux Action & Type Imports ---

const NewQuestion: React.FC = () => {
  const [optionOneText, setOptionOneText] = useState('');
  const [optionTwoText, setOptionTwoText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Explicitly type dispatch with AppDispatch for RTK compatibility
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  /**
   * AUTHED USER SELECTOR
   * Selects the current logged-in user's ID from state.
   */
  const authedUser = useSelector((state: RootState) => state.authedUser);

  /**
   * FORM SUBMISSION
   * Uses Redux Toolkit's dispatching mechanism to trigger the async action.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const o1 = optionOneText.trim();
    const o2 = optionTwoText.trim();

    // Guard against empty inputs or missing auth state
    if (!o1 || !o2 || !authedUser) {
      return;
    }

    setIsSubmitting(true);

    try {
      /**
       * RTK Async Thunk Dispatch
       * The thunk expects { optionOneText: string; optionTwoText: string; }.
       * It handles the 'author' internally via getState().
       */
      await dispatch(handleAddQuestion({
        optionOneText: o1,
        optionTwoText: o2
      })).unwrap();
      
      setOptionOneText('');
      setOptionTwoText('');
      
      // Navigate to dashboard upon success
      navigate('/');
    } catch (error) {
      console.error("Failed to save the poll:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInvalid = optionOneText.trim() === '' || optionTwoText.trim() === '' || isSubmitting;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase relative z-10">
            Create New Poll
          </h1>
          <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 relative z-10">
            Would You Rather
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="group">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Option One
              </label>
              <input
                type="text"
                placeholder="Enter first option..."
                value={optionOneText}
                onChange={(e) => setOptionOneText(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all font-medium text-slate-700 shadow-inner"
                disabled={isSubmitting}
                data-testid="option-one"
              />
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-slate-100 flex-grow"></div>
              <span className="text-slate-300 font-black italic text-xs uppercase select-none">OR</span>
              <div className="h-px bg-slate-100 flex-grow"></div>
            </div>

            <div className="group">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Option Two
              </label>
              <input
                type="text"
                placeholder="Enter second option..."
                value={optionTwoText}
                onChange={(e) => setOptionTwoText(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all font-medium text-slate-700 shadow-inner"
                disabled={isSubmitting}
                data-testid="option-two"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isInvalid}
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
              isInvalid
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Submit Poll'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewQuestion;