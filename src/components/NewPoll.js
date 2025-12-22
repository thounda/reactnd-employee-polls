/**
 * File: src/components/NewPoll.js
 * Description: Component for creating new polls. 
 * Linked to: src/actions/questions.js (handleAddQuestion)

 * Description: A Redux-connected React component that allows authenticated users 
 * to create new "Would You Rather" polls. It utilizes local state for form control 
 * and dispatches an asynchronous thunk to save the question to the store/database.
 */

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleAddQuestion } from '../actions/questions';

const NewPoll = () => {
  const [optionOneText, setOptionOneText] = useState('');
  const [optionTwoText, setOptionTwoText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (optionOneText.trim() === '' || optionTwoText.trim() === '') {
      return; 
    }

    setIsSubmitting(true);

    // Dispatching the real thunk action creator
    dispatch(handleAddQuestion(optionOneText, optionTwoText))
      .then(() => {
        setIsSubmitting(false);
        navigate('/');
      })
      .catch((err) => {
        console.error("Error creating poll:", err);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div className="w-full max-w-md bg-white rounded-xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-black">
            Create New Poll
          </h2>
          <p className="font-bold text-gray-500 mt-2 italic">Complete the question:</p>
          <p className="text-xl font-black mt-4 uppercase text-black">Would You Rather...</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase mb-1 text-black">
              Option One
            </label>
            <input
              type="text"
              placeholder="Enter Option One Text Here"
              value={optionOneText}
              onChange={(e) => setOptionOneText(e.target.value)}
              className="w-full p-4 border-2 border-black rounded-lg font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
            />
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="h-[2px] bg-black flex-1"></div>
            <span className="font-black text-sm uppercase text-black">OR</span>
            <div className="h-[2px] bg-black flex-1"></div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-1 text-black">
              Option Two
            </label>
            <input
              type="text"
              placeholder="Enter Option Two Text Here"
              value={optionTwoText}
              onChange={(e) => setOptionTwoText(e.target.value)}
              className="w-full p-4 border-2 border-black rounded-lg font-bold placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !optionOneText.trim() || !optionTwoText.trim()}
            className="w-full py-4 bg-yellow-400 border-2 border-black rounded-lg font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-black"
          >
            {isSubmitting ? 'Posting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPoll;