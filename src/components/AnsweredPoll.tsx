/**
 * FILE: AnsweredPoll.tsx
 * PATH: /src/components/AnsweredPoll.tsx
 * DESCRIPTION:
 * A presentational component used to display the results of a poll after the 
 * user has voted. It calculates percentages and highlights the user's choice.
 */

import React from 'react';

// --- START: Interface Definitions ---
interface PollOption {
  votes: string[];
  text: string;
}

interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: PollOption;
  optionTwo: PollOption;
}

interface AnsweredPollProps {
  question: Question;
  authedUser: string;
}
// --- END: Interface Definitions ---

/**
 * AnsweredPoll Component
 * Renders a statistical breakdown of votes for a specific question.
 * Uses a premium, data-driven design language with smooth transitions.
 */
const AnsweredPoll: React.FC<AnsweredPollProps> = ({ question, authedUser }) => {
  const optionOneVotes = question.optionOne.votes.length;
  const optionTwoVotes = question.optionTwo.votes.length;
  const totalVotes = optionOneVotes + optionTwoVotes;

  // Determine which option the authenticated user voted for
  const userSelected = question.optionOne.votes.includes(authedUser)
    ? 'optionOne'
    : question.optionTwo.votes.includes(authedUser)
    ? 'optionTwo'
    : null;

  /**
   * Calculates the percentage of total votes for an option.
   */
  const calculatePercentage = (votes: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  /**
   * Helper function to render the result card for each option.
   */
  const renderOptionResult = (
    option: 'optionOne' | 'optionTwo', 
    votes: number, 
    isUserChoice: boolean
  ) => {
    const pct = calculatePercentage(votes);
    const text = question[option].text;
    const label = option === 'optionOne' ? 'Alpha' : 'Beta';

    return (
      <div 
        key={option} 
        className={`relative p-8 rounded-[2.5rem] border-2 transition-all duration-700 ease-out overflow-hidden group ${
          isUserChoice 
            ? 'border-indigo-500 bg-white shadow-2xl shadow-indigo-100/50 scale-[1.02] z-10' 
            : 'border-slate-50 bg-slate-50/40 opacity-80'
        }`}
      >
        {/* User Choice Badge */}
        {isUserChoice && (
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-black px-5 py-2 rounded-bl-2xl uppercase tracking-[0.2em] shadow-lg">
            Your Decision
          </div>
        )}

        {/* Header Stats */}
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1 max-w-[70%]">
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
              isUserChoice ? 'text-indigo-500' : 'text-slate-400'
            }`}>
              Selection {label}
            </span>
            <h3 className={`text-xl font-bold uppercase tracking-tight leading-tight ${
              isUserChoice ? 'text-slate-900' : 'text-slate-500'
            }`}>
              {text}
            </h3>
          </div>
          <div className="text-right">
            <span className={`text-3xl font-black italic tracking-tighter ${
              isUserChoice ? 'text-indigo-600' : 'text-slate-300'
            }`}>
              {pct}%
            </span>
          </div>
        </div>
        
        {/* Animated Progress Bar Container */}
        <div className="relative h-4 w-full bg-slate-200/50 rounded-full overflow-hidden mb-6 shadow-inner">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
              isUserChoice 
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                : 'bg-slate-400'
            }`} 
            style={{ width: `${pct}%` }}
          >
            {/* Subtle glass effect on the bar */}
            <div className="absolute inset-0 bg-white/10 w-full h-1/2"></div>
          </div>
        </div>
        
        {/* Footer Data */}
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em]">
          <span className={`px-3 py-1.5 rounded-full ${
            isUserChoice ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
          }`}>
            {votes} {votes === 1 ? 'Vote' : 'Votes'}
          </span>
          <span className="text-slate-300">
            {pct}% of Total
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 py-4">
      {/* Title Section */}
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-indigo-200"></div>
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em]">Tally Results</span>
          <div className="h-px w-8 bg-indigo-200"></div>
        </div>
        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
          Poll Feedback
        </h2>
      </div>
      
      {/* Options Stack */}
      <div className="space-y-6">
        {renderOptionResult('optionOne', optionOneVotes, userSelected === 'optionOne')}
        {renderOptionResult('optionTwo', optionTwoVotes, userSelected === 'optionTwo')}
      </div>

      {/* Footer Summary */}
      <div className="pt-8 flex flex-col items-center">
        <div className="relative flex flex-col items-center group cursor-default">
          <div className="absolute -inset-4 bg-indigo-50/50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex flex-col items-center">
            <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full mb-4 animate-pulse"></div>
            <p className="text-[11px] text-slate-400 uppercase tracking-[0.4em] font-black">
              Total Participants: <span className="text-slate-900">{totalVotes}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnsweredPoll;