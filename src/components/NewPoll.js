/**
 * File: src/components/NewPoll.js
 * Description: 
 * Component for creating a new "Would You Rather" poll.
 * * Features:
 * 1. Controlled inputs for Option One and Option Two.
 * 2. Form validation to ensure both fields are filled.
 * 3. Dispatches cr
 * eatePoll action to the Redux store.
 * 4. Automatic navigation back to home upon success.
 * * Fixes applied:
 * - Resolved 'react-redux' dependency mapping.
 * - Updated action import to use 'createPoll' from our centralized Redux store.
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPoll } from '../store/index'; // Using the action from our RTK store

const NewPoll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authedUser = useSelector((state) => state.authedUser);
  
  const [optionOneText, setOptionOneText] = useState('');
  const [optionTwoText, setOptionTwoText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!optionOneText || !optionTwoText) return;

    setIsSubmitting(true);

    try {
      // Dispatch the combined action that handles API and Store updates
      await dispatch(createPoll({
        optionOneText,
        optionTwoText,
        author: authedUser
      }));
      
      // Navigate home after successful creation
      navigate('/');
    } catch (error) {
      console.error('Failed to create poll:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Create New Poll</h1>
        <p className="text-gray-500 mt-2 text-lg">Challenge your coworkers with a new question.</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <h2 className="text-white text-xl font-bold uppercase tracking-widest">Would You Rather...</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
          {/* Option One */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Option One</label>
            <input
              type="text"
              placeholder="Enter first option here..."
              value={optionOneText}
              onChange={(e) => setOptionOneText(e.target.value)}
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-800 font-medium text-lg shadow-inner"
              disabled={isSubmitting}
              data-testid="option-one-input"
            />
          </div>

          {/* Separator */}
          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-100"></div>
            </div>
            <span className="relative px-6 bg-white text-gray-300 font-black italic text-xl">OR</span>
          </div>

          {/* Option Two */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Option Two</label>
            <input
              type="text"
              placeholder="Enter second option here..."
              value={optionTwoText}
              onChange={(e) => setOptionTwoText(e.target.value)}
              className="w-full p-5 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none text-gray-800 font-medium text-lg shadow-inner"
              disabled={isSubmitting}
              data-testid="option-two-input"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !optionOneText || !optionTwoText}
            className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl flex items-center justify-center gap-3 ${
              isSubmitting || !optionOneText || !optionTwoText
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-blue-200'
            }`}
            data-testid="submit-poll-button"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              'Submit Poll'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPoll;