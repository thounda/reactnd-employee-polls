/**
 * File: src/components/QuestionPage.js
 * Description: Renders the detailed view for a single poll question. 
 * Extracts only the necessary slices from the Redux state to avoid 
 * performance warnings and unnecessary re-renders.
 */
import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { handleAddAnswer } from '../actions/questions.js';
import Avatar from './Avatar.js';

/**
 * @description Renders the detailed view for a single poll question,
 * allowing the user to vote or view the results.
 */
function QuestionPage() {
  const dispatch = useDispatch();
  const { qid } = useParams();
  
  // FIXED: Select specific slices instead of the whole state to fix the Console Warning
  const authedUser = useSelector((state) => state.authedUser);
  const questions = useSelector((state) => state.questions);
  const users = useSelector((state) => state.users);

  // Derive necessary data based on the question ID
  const question = questions[qid];
  const author = question ? users[question.author] : null;

  // Check if the current authenticated user has already answered this question
  const hasAnswered = (authedUser && users[authedUser]?.answers?.[qid]) !== undefined;

  const [selectedOption, setSelectedOption] = useState('');
  const [showResults, setShowResults] = useState(hasAnswered);

  // Sync internal view state if the user answers the poll
  useEffect(() => {
    if (hasAnswered) {
      setShowResults(true);
    }
  }, [hasAnswered]);

  // If question data is null (invalid URL), redirect to 404
  if (!question || !author) {
    return <Navigate to="/404" />;
  }
  
  const handleVote = (e) => {
    e.preventDefault();
    if (selectedOption) {
      dispatch(handleAddAnswer(qid, selectedOption));
    }
  };
  
  // Result calculations
  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;
  const userVote = users[authedUser]?.answers?.[qid];

  const calculatePercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes.length / totalVotes) * 100).toFixed(1);
  };

  const renderResultBox = (option, votes, percentage, optionKey) => (
    <div 
      className={`relative p-6 rounded-lg shadow-inner mb-4 transition duration-300 
        ${userVote === optionKey ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-50 border border-gray-200'}`
      }
    >
      <p className="text-xl font-medium text-gray-800 mb-2">{option.text}</p>
      
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div 
          className="bg-indigo-600 h-4 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <p className="font-semibold text-indigo-700">{percentage}%</p>
        <p>{votes} out of {totalVotes} votes</p>
      </div>

      {userVote === optionKey && (
        <span className="absolute top-[-10px] right-[-10px] bg-green-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg">
          Your Vote
        </span>
      )}
    </div>
  );
  
  return (
    <div className="max-w-xl mx-auto mt-8 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-indigo-50 p-6 border-b border-indigo-200 flex items-center space-x-4">
        <Avatar url={author.avatarURL} name={author.name} size="w-16 h-16 border-4 border-white shadow-md" />
        <h2 className="text-2xl font-bold text-indigo-800">{author.name} asks:</h2>
      </div>

      <div className="p-8">
        <h3 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Would You Rather...</h3>

        {showResults ? (
          <div>
            <p className="text-lg text-gray-600 mb-6 text-center">
              Total Votes: <span className="font-bold text-indigo-600">{totalVotes}</span>
            </p>
            {renderResultBox(question.optionOne, question.optionOne.votes.length, calculatePercentage(question.optionOne.votes), 'optionOne')}
            {renderResultBox(question.optionTwo, question.optionTwo.votes.length, calculatePercentage(question.optionTwo.votes), 'optionTwo')}
            
            <div className='mt-6 text-center'>
              <Link to="/" className="inline-block px-6 py-2 border border-indigo-600 rounded-lg text-indigo-600 font-medium hover:bg-indigo-50 transition">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVote}>
            <div className="space-y-4 mb-8">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${selectedOption === 'optionOne' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500' : 'border-gray-300 hover:bg-gray-50'}`}>
                <input type="radio" name="option" value="optionOne" checked={selectedOption === 'optionOne'} onChange={() => setSelectedOption('optionOne')} className="w-5 h-5 text-indigo-600" />
                <span className="ml-4 text-lg font-medium text-gray-800">{question.optionOne.text}</span>
              </label>

              <div className="text-center text-sm font-semibold text-gray-500 my-4">OR</div>

              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${selectedOption === 'optionTwo' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500' : 'border-gray-300 hover:bg-gray-50'}`}>
                <input type="radio" name="option" value="optionTwo" checked={selectedOption === 'optionTwo'} onChange={() => setSelectedOption('optionTwo')} className="w-5 h-5 text-indigo-600" />
                <span className="ml-4 text-lg font-medium text-gray-800">{question.optionTwo.text}</span>
              </label>
            </div>

            <button type="submit" disabled={!selectedOption} className={`w-full py-3 px-4 rounded-lg text-xl font-semibold text-white transition ${selectedOption ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}>
              Submit Vote
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default QuestionPage;