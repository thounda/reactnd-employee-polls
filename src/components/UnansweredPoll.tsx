/**
 * FILE: UnansweredPoll.tsx
 * PATH: /src/components/unansweredPoll.tsx
 * DESCRIPTION: 
 * Component for voting on polls. Focused on premium interaction design, 
 * tactile radio buttons, and a high-contrast submission state.
 */

import React, { useState } from 'react';

// --- START: Interface Definitions ---
interface PollOption {
  text: string;
  votes: string[];
}

interface Question {
  id: string;
  optionOne: PollOption;
  optionTwo: PollOption;
}

interface Author {
  name: string;
  avatarURL?: string;
}

interface UnansweredPollProps {
  question: Question;
  author: Author;
  dispatch: any; // In VS Code, replace 'any' with your 'AppDispatch' type if available
}
// --- END: Interface Definitions ---

const UnansweredPoll: React.FC<UnansweredPollProps> = ({ question, author, dispatch }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Handles the asynchronous submission to Redux.
   * Utilizes the 'questions/addAnswer' action type.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedOption) {
      setIsSubmitting(true);
      try {
        await dispatch({
          type: 'questions/addAnswer',
          payload: { qid: question.id, answer: selectedOption }
        });
        // Note: The parent component usually handles the redirect/view-switch 
        // once the store updates and props change.
      } catch (error) {
        console.error('Error submitting answer:', error);
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  if (!question || !author) return null;

  return (
    <div className="w-full max-w-xl mx-auto py-4">
      {/* Editorial Header */}
      <div className="flex flex-col items-center justify-center space-y-3 mb-12">
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-slate-200"></div>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">
            Question by {author.name}
          </span>
          <div className="h-px w-6 bg-slate-200"></div>
        </div>
        <h1 className="text-5xl font-black text-slate-900 text-center italic tracking-tighter uppercase leading-[0.9] lg:text-6xl">
          Would You <br/>
          <span className="text-indigo-600 not-italic">Rather...</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Option Cards */}
        {[
          { id: 'optionOne', data: question.optionOne, label: 'Alpha' },
          { id: 'optionTwo', data: question.optionTwo, label: 'Beta' }
        ].map((opt) => (
          <label 
            key={opt.id}
            className={`group relative block border-2 p-8 rounded-[2.5rem] cursor-pointer transition-all duration-500 ease-out ${
              selectedOption === opt.id 
                ? 'border-indigo-600 bg-white shadow-2xl shadow-indigo-100/50 scale-[1.02] z-10' 
                : 'border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Custom Radio Button */}
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  selectedOption === opt.id 
                    ? 'border-indigo-600 bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' 
                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                }`}>
                  <div className={`w-2.5 h-2.5 bg-white rounded-full transition-transform duration-500 ${
                    selectedOption === opt.id ? 'scale-100' : 'scale-0'
                  }`}></div>
                </div>

                <div className="flex flex-col">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${
                    selectedOption === opt.id ? 'text-indigo-500' : 'text-slate-400'
                  }`}>
                    Option {opt.label}
                  </span>
                  <span className={`text-xl font-bold uppercase tracking-tight transition-colors duration-500 ${
                    selectedOption === opt.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'
                  }`}>
                    {opt.data.text}
                  </span>
                </div>
              </div>

              {/* Hidden Native Input */}
              <input
                type="radio"
                name="answer"
                value={opt.id}
                checked={selectedOption === opt.id}
                onChange={handleChange}
                className="sr-only"
              />
            </div>
          </label>
        ))}

        {/* Separator / VS logic */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative bg-white px-4">
            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">VS</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={!selectedOption || isSubmitting}
            className={`w-full group relative overflow-hidden py-6 px-8 rounded-[2rem] font-black text-[11px] tracking-[0.4em] uppercase transition-all duration-500 ${
              !selectedOption || isSubmitting 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="relative z-10">Confirm Selection</span>
            )}
            
            {/* Subtle button shine effect */}
            {!isSubmitting && selectedOption && (
              <div className="absolute inset-0 w-1/2 h-full bg-white/5 skew-x-[45deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000"></div>
            )}
          </button>
        </div>
      </form>

      {/* Trust Badge */}
      <div className="mt-16 flex flex-col items-center opacity-50">
        <div className="flex gap-1 mb-3">
          {[1, 2, 3].map(i => <div key={i} className="h-1 w-1 bg-slate-300 rounded-full"></div>)}
        </div>
        <p className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black text-center max-w-[200px] leading-relaxed">
          Submission will be etched into the global tally
        </p>
      </div>
    </div>
  );
};

export default UnansweredPoll;