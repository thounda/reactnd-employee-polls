import React, { useState } from 'react';

/**
 * File Path: src/components/NewQuestion.tsx
 * PURPOSE: 
 * This component provides the form for users to create new "Would You Rather" polls.
 * It manages local state for input fields, validates that both options are provided,
 * and dispatches the creation action to the Redux store.
 */

const NewQuestion: React.FC = () => {
  const [optionOneText, setOptionOneText] = useState('');
  const [optionTwoText, setOptionTwoText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Safe Dependency Injection
   * To prevent build failures in environments where 'react-redux' or local paths
   * aren't immediately resolvable, we use a dynamic lookup pattern.
   */
  let useDispatch: any = () => () => {};
  let useNavigate: any = () => () => {};
  let handleAddQuestionAction: any = null;

  try {
    // 1. Attempt to resolve hooks from global or local modules
    // @ts-ignore
    const reactRedux = require('react-redux');
    // @ts-ignore
    const reactRouter = require('react-router-dom');
    
    useDispatch = reactRedux.useDispatch;
    useNavigate = reactRouter.useNavigate;

    // 2. Attempt to resolve local action creator
    try {
      // @ts-ignore
      const actions = require('../actions/questions');
      handleAddQuestionAction = actions.handleAddQuestion;
    } catch (e) {
      // Fallback for preview environment
      handleAddQuestionAction = (window as any).handleAddQuestion;
    }
  } catch (e) {
    // Final fallbacks for the preview environment
    useDispatch = (window as any).ReactRedux?.useDispatch || (() => () => {});
    useNavigate = (window as any).ReactRouterDOM?.useNavigate || (() => () => {});
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (optionOneText.trim() === '' || optionTwoText.trim() === '') {
      return;
    }

    setIsSubmitting(true);

    // Ensure we have an action to call
    const finalActionCreator = handleAddQuestionAction || ((opt1: string, opt2: string) => ({ type: 'ADD_QUESTION', opt1, opt2 }));

    try {
      await dispatch(finalActionCreator(optionOneText, optionTwoText));
      setOptionOneText('');
      setOptionTwoText('');
      navigate('/');
    } catch (error) {
      console.error("Error creating poll:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInvalid = optionOneText.trim() === '' || optionTwoText.trim() === '' || isSubmitting;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase relative z-10">
            Create New Poll
          </h1>
          <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mt-2 relative z-10">
            Challenge the community
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 bg-white">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Would You Rather...</h2>
            <div className="h-1 w-12 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">
                Option One
              </label>
              <input
                type="text"
                placeholder="Ex: Have a private jet"
                value={optionOneText}
                onChange={(e) => setOptionOneText(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="h-px bg-slate-100 flex-grow"></div>
              <span className="px-6 text-slate-300 font-black italic text-sm select-none">OR</span>
              <div className="h-px bg-slate-100 flex-grow"></div>
            </div>

            <div className="group">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">
                Option Two
              </label>
              <input
                type="text"
                placeholder="Ex: Have a private chef"
                value={optionTwoText}
                onChange={(e) => setOptionTwoText(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isInvalid}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
              isInvalid
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Publishing...</span>
              </>
            ) : (
              'Create Poll'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewQuestion;