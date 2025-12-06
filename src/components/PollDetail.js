/**
 * File: src/components/PollDetail.js
 * Description: Component for viewing the details of a single poll.
 * If the user hasn't voted, they can vote. If they have voted, they see the results.
 */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';
import Avatar from './Avatar.js';
import { handleAddAnswer } from '../actions/questions.js';
import NotFound from './NotFound.js';

function PollDetail() {
  const dispatch = useDispatch();
  
  // 1. Get the question ID from the URL parameters
  const { question_id } = useParams();

  // 2. Fetch necessary data from the store
  const authedUserId = useSelector((state) => state.authedUser);
  const questions = useSelector((state) => state.questions);
  const users = useSelector((state) => state.users);

  // Local state for the voting form (MOVED UP TO FIX HOOK ERROR)
  const [selectedOption, setSelectedOption] = useState('');
  
  // --- Initial Data Check ---
  const question = questions[question_id];

  if (!question) {
    // If the question ID is invalid or the data hasn't loaded (though App.js handles loading), show 404
    return <NotFound />;
  }

  // --- Determine Poll State ---
  const author = users[question.author];
  const userAnswers = users[authedUserId].answers;
  const hasVoted = Object.keys(userAnswers).includes(question_id);
  const userChoice = hasVoted ? userAnswers[question_id] : null;


  // --- Result Calculation (for Results View) ---
  const optionOneVotes = question.optionOne.votes.length;
  const optionTwoVotes = question.optionTwo.votes.length;
  const totalVotes = optionOneVotes + optionTwoVotes;

  const getPercentage = (votes) => {
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };
  
  // Data structure for easy rendering
  const options = [
    {
      id: 'optionOne',
      text: question.optionOne.text,
      votes: optionOneVotes,
      percentage: getPercentage(optionOneVotes),
    },
    {
      id: 'optionTwo',
      text: question.optionTwo.text,
      votes: optionTwoVotes,
      percentage: getPercentage(optionTwoVotes),
    },
  ];

  // --- Event Handler ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedOption) {
      const info = {
        authedUser: authedUserId,
        qid: question_id,
        answer: selectedOption,
      };
      
      // Dispatch the thunk action to save the answer in the API and Redux store
      dispatch(handleAddAnswer(info));
    }
  };

  // --- Render Functions ---

  // Renders the section for a single option in the results view
  const renderResultOption = (option) => {
    const isChosen = userChoice === option.id;

    return (
      <div 
        key={option.id} 
        className={`p-6 rounded-xl border-2 shadow-md transition duration-300 ${
          isChosen
            ? 'border-green-500 bg-green-50 relative ring-4 ring-green-200'
            : 'border-gray-200 bg-gray-50'
        }`}
      >
        {/* User Choice Label */}
        {isChosen && (
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg rotate-6">
            Your Vote
          </div>
        )}

        <p className="text-xl font-semibold text-gray-800 mb-3">
          Would you rather {option.text}?
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
          <div 
            className="h-6 rounded-full text-center text-sm font-medium text-white transition-all duration-500 ease-out" 
            style={{ 
              width: `${option.percentage}%`, 
              backgroundColor: isChosen ? '#10B981' : '#4F46E5' // Indigo or Green
            }}
          >
            {option.percentage}%
          </div>
        </div>
        
        {/* Vote Count */}
        <p className="text-center text-sm text-gray-500 mt-2">
          {option.votes} out of {totalVotes} votes
        </p>
      </div>
    );
  };

  // Renders the voting form
  const renderVotingView = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {options.map((option) => (
        <label
          key={option.id}
          htmlFor={option.id}
          className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition duration-200 shadow-sm ${
            selectedOption === option.id
              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-300'
              : 'border-gray-200 hover:border-indigo-400 bg-white'
          }`}
        >
          <input
            type="radio"
            id={option.id}
            name="poll-option"
            value={option.id}
            checked={selectedOption === option.id}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2"
          />
          <span className="ml-3 text-lg font-medium text-gray-800">
            {option.text}
          </span>
        </label>
      ))}

      <button
        type="submit"
        disabled={!selectedOption}
        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Vote
      </button>
    </form>
  );

  // Renders the results view
  const renderResultsView = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-700 text-center mb-4">Results</h3>
      {options.map(renderResultOption)}
      <p className="text-center text-xl font-semibold text-indigo-700 pt-2">
        Total Votes: {totalVotes}
      </p>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      
      {/* Header: Author Info */}
      <div className="flex items-center space-x-4 pb-6 border-b border-gray-100 mb-6">
        <Avatar url={author.avatarURL} name={author.name} size="w-16 h-16" />
        <div>
          <h2 className="text-3xl font-extrabold text-indigo-700">
            {author.name} Asks:
          </h2>
          <p className="text-gray-500 text-lg">Would You Rather...</p>
        </div>
      </div>

      {/* Main Content: Voting or Results */}
      {hasVoted ? renderResultsView() : renderVotingView()}
      
    </div>
  );
}

export default PollDetail;