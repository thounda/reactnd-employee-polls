/**
 * File: src/components/PollCard.js
 * Description: A reusable component to render a single poll question.
 * It displays basic information and provides a link to the detailed view.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from './Avatar.js';

/**
 * @param {Object} props
 * @param {string} props.qid - The ID of the question to display.
 * @param {boolean} [props.showViewLink=true] - If true, displays the "View Poll" link (used on Dashboard).
 * @returns {JSX.Element}
 */
function PollCard({ qid, showViewLink = true }) {
  const question = useSelector(state => state.questions[qid]);
  const author = useSelector(state => state.users[question.author]);

  if (!question || !author) {
    // Should not happen if data is loaded, but handles edge case
    return <div className="text-center text-red-500">Error: Poll or Author not found.</div>;
  }

  const { name, avatarURL } = author;

  return (
    <div className="flex bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition duration-300 hover:shadow-xl hover:border-indigo-200">
      
      {/* Left Column: Author Info */}
      <div className="w-1/3 bg-indigo-50 p-4 flex flex-col items-center justify-center border-r border-indigo-100">
        <h3 className="text-xl font-semibold text-indigo-700 mb-2 text-center">{name} asks:</h3>
        <Avatar url={avatarURL} name={name} size="w-20 h-20" />
      </div>

      {/* Right Column: Poll Content */}
      <div className="w-2/3 p-6 flex flex-col justify-between">
        <h4 className="text-2xl font-bold text-gray-800 mb-4">Would You Rather...</h4>
        
        {/* Display the first option snippet */}
        <p className="text-lg text-gray-600 mb-6 truncate">
          {question.optionOne.text} <span className="font-semibold text-gray-500">...or...</span>
        </p>
        
        {/* View Poll Button (if enabled) */}
        {showViewLink && (
          <Link
            to={`/questions/${qid}`}
            className="w-full text-center py-3 px-4 border border-indigo-600 rounded-lg text-lg font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition duration-150 transform hover:scale-[1.01] shadow-md"
          >
            View Poll
          </Link>
        )}
      </div>
    </div>
  );
}

export default PollCard;