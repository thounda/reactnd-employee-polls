import React, { useState } from 'react';

/**
 * FILE: src/components/UnansweredPoll.tsx
 * DESCRIPTION: 
 * Component for voting on polls that the user hasn't answered yet.
 * Converted to Functional Component with TypeScript and Tailwind CSS.
 * Uses robust state management for the voting process.
 */

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
  dispatch: any; 
}

const UnansweredPoll: React.FC<UnansweredPollProps> = ({ question, author, dispatch }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Helper to handle the voting logic
  // In a full environment, handleAddAnswer would be imported from slices/questionsSlice
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedOption) {
      setIsSubmitting(true);
      try {
        // We use the action type string to ensure compatibility with the reducer
        // even if direct imports are currently restricted in the build environment.
        await dispatch({
          type: 'questions/addAnswer',
          payload: { qid: question.id, answer: selectedOption }
        });
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
    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-lg mx-auto border border-slate-100 transform transition-all duration-500 hover:shadow-indigo-100/50">
      {/* Author Header */}
      <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-center justify-center space-x-3">
        {author.avatarURL && (
          <img src={author.avatarURL} alt="" className="w-6 h-6 rounded-full" />
        )}
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {author.name} <span className="text-indigo-600 italic">asks the community</span>
        </h2>
      </div>

      <div className="p-10">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 text-center italic tracking-tighter uppercase leading-none">
            Would You <br/> Rather...
          </h1>
          <div className="h-1.5 w-12 bg-indigo-600 rounded-full mt-4"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Option One */}
          <label 
            className={`group block border-2 p-6 rounded-3xl cursor-pointer transition-all duration-300 ${
              selectedOption === 'optionOne' 
                ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100' 
                : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                selectedOption === 'optionOne' ? 'border-indigo-600 bg-indigo-600 scale-110' : 'border-slate-300'
              }`}>
                {selectedOption === 'optionOne' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
              <input
                type="radio"
                name="answer"
                value="optionOne"
                checked={selectedOption === 'optionOne'}
                onChange={handleChange}
                className="hidden"
              />
              <span className={`text-base font-black uppercase tracking-tight transition-colors ${
                selectedOption === 'optionOne' ? 'text-indigo-900' : 'text-slate-500 group-hover:text-slate-900'
              }`}>
                {question.optionOne.text}
              </span>
            </div>
          </label>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">OR</span>
          </div>

          {/* Option Two */}
          <label 
            className={`group block border-2 p-6 rounded-3xl cursor-pointer transition-all duration-300 ${
              selectedOption === 'optionTwo' 
                ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100' 
                : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                selectedOption === 'optionTwo' ? 'border-indigo-600 bg-indigo-600 scale-110' : 'border-slate-300'
              }`}>
                {selectedOption === 'optionTwo' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
              <input
                type="radio"
                name="answer"
                value="optionTwo"
                checked={selectedOption === 'optionTwo'}
                onChange={handleChange}
                className="hidden"
              />
              <span className={`text-base font-black uppercase tracking-tight transition-colors ${
                selectedOption === 'optionTwo' ? 'text-indigo-900' : 'text-slate-500 group-hover:text-slate-900'
              }`}>
                {question.optionTwo.text}
              </span>
            </div>
          </label>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!selectedOption || isSubmitting}
            className={`w-full mt-10 py-5 px-6 rounded-2xl text-white font-black text-xs tracking-[0.2em] uppercase transition-all duration-500 shadow-xl ${
              !selectedOption || isSubmitting 
              ? 'bg-slate-200 cursor-not-allowed shadow-none' 
              : 'bg-slate-900 hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Cast Decision'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnansweredPoll;