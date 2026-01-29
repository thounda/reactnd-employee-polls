import React, { useState } from 'react';

/**
 * FILE: src/components/UnansweredPoll.tsx
 * DESCRIPTION: 
 * Component for voting on polls that the user hasn't answered yet.
 * Refined for visual parity with AnsweredPoll and QuestionPage components.
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedOption) {
      setIsSubmitting(true);
      try {
        // Dispatching to the centralized questionsSlice logic
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
    <div className="w-full max-w-lg mx-auto">
      {/* Header Context */}
      <div className="flex flex-col items-center justify-center space-y-2 mb-8">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Inquiry by {author.name}</span>
        <h1 className="text-4xl font-black text-slate-900 text-center italic tracking-tighter uppercase leading-none">
          Would You <br/> Rather...
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Option One */}
        <label 
          className={`group relative block border-2 p-8 rounded-[2rem] cursor-pointer transition-all duration-500 ${
            selectedOption === 'optionOne' 
              ? 'border-indigo-500 bg-indigo-50/30 shadow-xl shadow-indigo-100/50' 
              : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full border-2 mr-6 flex items-center justify-center transition-all duration-500 ${
              selectedOption === 'optionOne' ? 'border-indigo-600 bg-indigo-600 scale-110 shadow-lg shadow-indigo-200' : 'border-slate-300'
            }`}>
              {selectedOption === 'optionOne' && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <input
              type="radio"
              name="answer"
              value="optionOne"
              checked={selectedOption === 'optionOne'}
              onChange={handleChange}
              className="hidden"
            />
            <span className={`text-lg font-bold uppercase tracking-tight transition-colors duration-500 ${
              selectedOption === 'optionOne' ? 'text-indigo-900' : 'text-slate-400 group-hover:text-slate-900'
            }`}>
              {question.optionOne.text}
            </span>
          </div>
        </label>

        <div className="relative flex items-center justify-center py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <span className="relative bg-white px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">VS</span>
        </div>

        {/* Option Two */}
        <label 
          className={`group relative block border-2 p-8 rounded-[2rem] cursor-pointer transition-all duration-500 ${
            selectedOption === 'optionTwo' 
              ? 'border-indigo-500 bg-indigo-50/30 shadow-xl shadow-indigo-100/50' 
              : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full border-2 mr-6 flex items-center justify-center transition-all duration-500 ${
              selectedOption === 'optionTwo' ? 'border-indigo-600 bg-indigo-600 scale-110 shadow-lg shadow-indigo-200' : 'border-slate-300'
            }`}>
              {selectedOption === 'optionTwo' && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <input
              type="radio"
              name="answer"
              value="optionTwo"
              checked={selectedOption === 'optionTwo'}
              onChange={handleChange}
              className="hidden"
            />
            <span className={`text-lg font-bold uppercase tracking-tight transition-colors duration-500 ${
              selectedOption === 'optionTwo' ? 'text-indigo-900' : 'text-slate-400 group-hover:text-slate-900'
            }`}>
              {question.optionTwo.text}
            </span>
          </div>
        </label>

        {/* Action Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={!selectedOption || isSubmitting}
            className={`w-full py-6 px-8 rounded-[1.5rem] font-black text-xs tracking-[0.3em] uppercase transition-all duration-500 shadow-2xl ${
              !selectedOption || isSubmitting 
              ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
              : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing Vote...
              </span>
            ) : 'Commit Decision'}
          </button>
        </div>
      </form>

      <div className="mt-12 flex flex-col items-center opacity-40">
        <div className="h-1 w-8 bg-slate-200 rounded-full mb-3"></div>
        <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black">
          Permanent Ledger Entry
        </p>
      </div>
    </div>
  );
};

export default UnansweredPoll;