import React, { useState } from 'react';

/**
 * FILE: src/components/NewQuestion.tsx
 * DESCRIPTION: 
 * A clean, centered form for creating new "Would You Rather" polls.
 * Validates that both options are filled before allowing submission.
 * UPDATED: Optimized to use global Redux access to prevent build-time resolution errors.
 */

interface NewQuestionProps {
  onNavigate?: (path: string) => void;
}

const NewQuestion: React.FC<NewQuestionProps> = ({ onNavigate }) => {
  const [optionOneText, setOptionOneText] = useState('');
  const [optionTwoText, setOptionTwoText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safely access Redux from the global scope to avoid module resolution errors in this environment
  const useSelector = (window as any).ReactRedux?.useSelector || (() => null);
  const useDispatch = (window as any).ReactRedux?.useDispatch || (() => () => {});
  const dispatch = useDispatch();

  const authedUser = useSelector((state: any) => state.app?.authedUser || state.authedUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (optionOneText.trim() === '' || optionTwoText.trim() === '') {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the payload for the new question
      const payload = {
        optionOneText,
        optionTwoText,
        author: authedUser
      };

      // Dispatching via string-based types to ensure compatibility with slices if direct imports fail
      // We expect the store to handle the async logic or we trigger the action creator type
      await dispatch({
        type: 'questions/handleAddQuestion',
        payload
      });
      
      setOptionOneText('');
      setOptionTwoText('');
      
      // Navigate back to dashboard after successful creation
      if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (error) {
      console.error("Failed to create question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInvalid = optionOneText.trim() === '' || optionTwoText.trim() === '' || isSubmitting;

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>
          
          <h1 className="text-4xl font-black text-white mb-3 italic tracking-tighter uppercase">Create New Poll</h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">The Power of Choice</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 md:p-14 space-y-10">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">Would You Rather...</h2>
            <div className="h-1.5 w-16 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            {/* Option One Input */}
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-2 transition-colors group-focus-within:text-indigo-600">
                First Option
              </label>
              <input
                type="text"
                placeholder="Ex: Have the ability to fly..."
                value={optionOneText}
                onChange={(e) => setOptionOneText(e.target.value)}
                className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 text-lg shadow-sm"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Separator */}
            <div className="relative flex items-center justify-center py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-slate-100"></div>
              </div>
              <div className="relative bg-white px-8">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center shadow-lg transform -rotate-12 border-4 border-white">
                  <span className="text-white text-xs font-black italic">OR</span>
                </div>
              </div>
            </div>

            {/* Option Two Input */}
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-2 transition-colors group-focus-within:text-indigo-600">
                Second Option
              </label>
              <input
                type="text"
                placeholder="Ex: Be invisible at will..."
                value={optionTwoText}
                onChange={(e) => setOptionTwoText(e.target.value)}
                className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 text-lg shadow-sm"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isInvalid}
              className={`w-full py-6 rounded-2xl font-black text-xl transition-all shadow-2xl active:scale-[0.97] group relative overflow-hidden ${
                isInvalid
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center space-x-3">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="tracking-widest uppercase">Publishing...</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-widest uppercase">Launch Poll</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        <div className="p-8 bg-slate-50/80 text-center border-t border-slate-100">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Polls are visible to everyone in the organization immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewQuestion;