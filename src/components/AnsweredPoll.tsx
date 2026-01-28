/**
 * File: src/components/AnsweredPoll.tsx
 * Description: A presentational component that displays the statistical results 
 * of a poll after the user has voted. It calculates percentages, highlights 
 * the user's specific choice, and identifies the current leading option.
 */

import React from 'react';

/**
 * Interface for individual poll options
 */
interface PollOption {
  votes: string[];
  text: string;
}

/**
 * Interface for the Question object structure
 */
interface Question {
  optionOne: PollOption;
  optionTwo: PollOption;
  id?: string;
  author?: string;
  timestamp?: number;
}

/**
 * Component Props
 * @param question - The full question object containing options and vote arrays
 * @param authedUser - The ID of the currently logged-in user to determine their selection
 */
interface AnsweredPollProps {
  question: Question;
  authedUser: string;
}

const AnsweredPoll: React.FC<AnsweredPollProps> = ({ question, authedUser }) => {
  // 1. Calculate the necessary vote totals
  const optionOneVotes = question.optionOne.votes.length;
  const optionTwoVotes = question.optionTwo.votes.length;
  const totalVotes = optionOneVotes + optionTwoVotes;

  // 2. Identify which option the user clicked
  const userSelected = question.optionOne.votes.includes(authedUser)
    ? 'optionOne'
    : question.optionTwo.votes.includes(authedUser)
    ? 'optionTwo'
    : null;

  // 3. Percentage calculation helper
  const calculatePercentage = (votes: number) => {
    if (totalVotes === 0) return '0%';
    return `${((votes / totalVotes) * 100).toFixed(1)}%`;
  };

  /**
   * Helper to render result cards for each option
   */
  const renderOptionResult = (
    option: 'optionOne' | 'optionTwo', 
    votes: number, 
    isUserChoice: boolean
  ) => {
    const percentage = calculatePercentage(votes);
    const text = question[option].text;
    
    // UI Logic: Highlight user's choice with indigo, winning/leading with yellow
    const userChoiceClasses = 'border-2 border-indigo-700 bg-indigo-50 shadow-md';
    const winningClasses = votes > 0 && votes >= Math.max(optionOneVotes, optionTwoVotes) 
      ? 'bg-yellow-100 border-2 border-yellow-500' 
      : 'bg-gray-50 border border-gray-200';

    return (
      <div 
        key={option} 
        className={`relative p-5 rounded-xl transition-all duration-300 ${isUserChoice ? userChoiceClasses : winningClasses} mb-4`}
      >
        <p className="text-lg font-bold text-gray-800 mb-2">
          {text}
        </p>
        
        {/* "Your Vote" Badge - only visible on the option the user chose */}
        {isUserChoice && (
          <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-black rounded-full shadow-lg z-10 uppercase tracking-tighter">
            Your Vote
          </div>
        )}
        
        {/* Progress Bar Container */}
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
          <div 
            className="bg-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: percentage }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-sm font-medium mt-3">
          <span className="text-indigo-700 font-bold text-base">{percentage}</span>
          <span className="text-gray-600 bg-white/50 px-2 py-0.5 rounded border border-gray-100">
            {votes} / {totalVotes} votes
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4 px-2">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <div className="h-px w-8 bg-gray-300"></div>
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest">Results</h2>
        <div className="h-px w-8 bg-gray-300"></div>
      </div>
      
      {renderOptionResult('optionOne', optionOneVotes, userSelected === 'optionOne')}
      {renderOptionResult('optionTwo', optionTwoVotes, userSelected === 'optionTwo')}

      <div className="mt-8 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
          Total Participation: {totalVotes}
        </p>
      </div>
    </div>
  );
};

export default AnsweredPoll;