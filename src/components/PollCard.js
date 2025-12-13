/**
 * File: src/components/PollCard.js
 * Description: Renders a summary card for a single poll question in the Dashboard list.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

function PollCard({ question, author, isAnswered }) {
  // Fallback check in case data is still loading or missing (shouldn't happen here)
  if (!question || !author) {
    return null;
  }

  // Determine the display message for the question summary
  const summaryText = question.optionOne.text.slice(0, 30) + '...';

  // Determine the route to view the details/results
  const pollUrl = `/questions/${question.id}`;
  
  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200">
      {/* Author Avatar (Placeholder) */}
      <img
        src={author.avatarURL || 'https://placehold.co/100x100/A5B4FC/ffffff?text=User'}
        alt={`Avatar of ${author.name}`}
        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
      />
      
      {/* Question Details */}
      <div className="flex-grow">
        <p className="text-sm font-semibold text-gray-900 mb-1">{author.name} asks:</p>
        <h3 className="text-lg font-bold text-indigo-600 mb-2">Would You Rather...</h3>
        <p className="text-gray-600 text-sm italic mb-3">
          {summaryText}
        </p>
      </div>

      {/* Action Button */}
      <Link
        to={pollUrl}
        className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors duration-150 shadow-sm
          ${isAnswered 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
      >
        {isAnswered ? 'View Results' : 'Answer Poll'}
      </Link>
    </div>
  );
}

/**
 * Maps state to props for a single PollCard.
 * @param {Object} state - The Redux store state.
 * @param {Object} ownProps - Props passed directly to the component (specifically questionId).
 * @returns {Object} Props containing the question object, author object, and answer status.
 */
function mapStateToProps({ questions, users, authedUser }, { questionId }) {
  const question = questions[questionId];
  const author = users[question.author];

  // Check if the current user has answered this specific question
  const isAnswered = users[authedUser]?.answers?.[questionId] !== undefined;

  return {
    question,
    author,
    isAnswered,
  };
}

export default connect(mapStateToProps)(PollCard);