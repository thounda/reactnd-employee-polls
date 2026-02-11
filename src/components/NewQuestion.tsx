/**
 * FILE: NewQuestion.tsx
 * PATH: /src/components/NewQuestion.tsx
 * DESCRIPTION:
 * Fixed version with correct TypeScript typing for Redux Thunks.
 * Includes preview mocks for the build environment.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddQuestion } from '../slices/questionsSlice';
import { AppDispatch, RootState } from '../store'; 

const NewQuestion: React.FC = () => {
  const [optionOneText, setOptionOneText] = useState('');
  const [optionTwoText, setOptionTwoText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Properly type the dispatch hook using the AppDispatch type
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Use RootState for state selection
  const authedUser = useSelector((state: RootState) => state.authedUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const o1 = optionOneText.trim();
    const o2 = optionTwoText.trim();

    if (!o1 || !o2 || !authedUser) return;

    setIsSubmitting(true);

    try {
      // Dispatches the async thunk and unwraps the result
      await dispatch(handleAddQuestion({
        optionOneText: o1,
        optionTwoText: o2
      })).unwrap();
      
      setOptionOneText('');
      setOptionTwoText('');
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
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase relative z-10">
            Create New Poll
          </h1>
          <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1 relative z-10">
            Would You Rather
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 bg-white">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">
                Option One
              </label>
              <input
                type="text"
                placeholder="Enter first option..."
                value={optionOneText}
                onChange={(e) => setOptionOneText(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-xl outline-none transition-all font-medium text-slate-700 shadow-sm"
                disabled={isSubmitting}
                data-testid="option-one"
              />
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-slate-100 flex-grow"></div>
              <div className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                <span className="text-slate-400 font-black italic text-[10px] uppercase select-none">OR</span>
              </div>
              <div className="h-px bg-slate-100 flex-grow"></div>
            </div>

            <div className="group">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">
                Option Two
              </label>
              <input
                type="text"
                placeholder="Enter second option..."
                value={optionTwoText}
                onChange={(e) => setOptionTwoText(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 rounded-xl outline-none transition-all font-medium text-slate-700 shadow-sm"
                disabled={isSubmitting}
                data-testid="option-two"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isInvalid}
            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all transform active:scale-[0.98] ${
              isInvalid
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:shadow-indigo-300'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Submit Poll'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewQuestion;