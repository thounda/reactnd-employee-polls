/**
 * File: src/components/AnsweredPoll.js
 * Description: Renders the results of an answered poll, showing vote counts and percentages.
 */
import React from 'react';

function AnsweredPoll({ question, authedUser }) {
  // 1. Calculate the necessary vote data
  const optionOneVotes = question.optionOne.votes.length;
  const optionTwoVotes = question.optionTwo.votes.length;
  const totalVotes = optionOneVotes + optionTwoVotes;

  // 2. Determine the user's chosen option
  const userSelected = authedUser 
    ? question.optionOne.votes.includes(authedUser) 
      ? 'optionOne' 
      : 'optionTwo' 
    : null; // Should not be null if this component is rendered

  // 3. Helper function to calculate percentage
  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return '0%';
    return `${((votes / totalVotes) * 100).toFixed(1)}%`;
  };

  // 4. Helper function to render a single option's results
  const renderOptionResult = (option, votes, isUserChoice) => {
    const percentage = calculatePercentage(votes);
    const text = question[option].text;
    
    // Styling for the user's selection
    const userChoiceClasses = 'border-2 border-indigo-700 bg-indigo-50 shadow-md';
    // Styling for the option with the most votes
    const winningClasses = votes > 0 && votes >= Math.max(optionOneVotes, optionTwoVotes) 
      ? 'bg-yellow-100 border-2 border-yellow-500' 
      : 'bg-gray-50';

    return (
      <div 
        key={option} 
        className={`relative p-5 rounded-xl transition duration-200 ${isUserChoice ? userChoiceClasses : winningClasses} mb-4`}
      >
        <p className="text-lg font-bold text-gray-800 mb-2">
          {text}
        </p>
        
        {/* User Choice Indicator */}
        {isUserChoice && (
          <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 p-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-lg">
            Your Vote
          </div>
        )}
        
        {/* Progress Bar and Stats */}
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
          <div 
            className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-out" 
            style={{ width: percentage }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-sm font-medium mt-1">
          <span className="text-indigo-700">{percentage}</span>
          <span className="text-gray-600">{votes} out of {totalVotes} votes</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4 px-4">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">Results:</h2>
      
      {/* Option One Results */}
      {renderOptionResult('optionOne', optionOneVotes, userSelected === 'optionOne')}
      
      {/* Option Two Results */}
      {renderOptionResult('optionTwo', optionTwoVotes, userSelected === 'optionTwo')}

      <p className="text-center text-sm text-gray-500 pt-4">
        Total votes cast: <span className="font-semibold text-gray-700">{totalVotes}</span>
      </p>
    </div>
  );
}

// AnsweredPoll does not need to be connected to Redux as all required data 
// (question, authedUser) is passed down via props from PollDetail.
export default AnsweredPoll;