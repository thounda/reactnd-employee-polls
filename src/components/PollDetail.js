/**
 * File: src/components/PollDetail.js
 * Description: 
 * Detailed view for a specific poll. 
 * Features include:
 * 1. Conditional Rendering: Shows voting interface if unanswered, results if answered.
 * 2. Voting Logic: Dispatches answerPoll to update Redux Toolkit state.
 * 3. Statistics: Calculates vote counts and percentages for both options.
 * 4. 404 Handling: Redirects if the question ID does not exist.
 * 5. Responsive UI: Clear distinction between the chosen option and others.
 * * Fixes applied:
 * - Resolved 'react-redux' dependency mapping.
 * - Updated action import to 'answerPoll' from our centralized Redux Toolkit store.
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { answerPoll } from '../store/index'; // Updated to use the RTK action from our store

const PollDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Extract data from Redux state using the keys defined in our store
  const authedUser = useSelector((state) => state.authedUser);
  const users = useSelector((state) => state.users);
  const questions = useSelector((state) => state.questions);

  const question = questions[id];

  // 404 Handling: If question doesn't exist, redirect or show error
  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-6xl font-black text-gray-200 mb-2">404</h2>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Poll Not Found</h3>
        <p className="text-gray-500 mb-8 max-w-xs">The question you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const author = users[question.author];
  const hasAnswered = 
    question.optionOne.votes.includes(authedUser) || 
    question.optionTwo.votes.includes(authedUser);

  const handleVote = (answer) => {
    // Using the RTK action we defined in src/store/index.ts
    dispatch(answerPoll({
      authedUser,
      qid: id,
      answer
    }));
  };

  // Stats calculation
  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;
  const optOneVotes = question.optionOne.votes.length;
  const optTwoVotes = question.optionTwo.votes.length;
  const optOnePercent = totalVotes === 0 ? 0 : ((optOneVotes / totalVotes) * 100).toFixed(1);
  const optTwoPercent = totalVotes === 0 ? 0 : ((optTwoVotes / totalVotes) * 100).toFixed(1);

  const userChoice = question.optionOne.votes.includes(authedUser) ? 'optionOne' : 'optionTwo';

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center gap-4">
          <img 
            src={author?.avatarURL} 
            alt={author?.name} 
            className="w-16 h-16 rounded-full ring-4 ring-white shadow-sm"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Poll by {author?.name}</h2>
            <p className="text-sm text-gray-500 font-medium">Would You Rather...</p>
          </div>
        </div>

        <div className="p-8">
          {!hasAnswered ? (
            /* Voting Interface */
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleVote('optionOne')}
                className="group p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
                  {question.optionOne.text}
                </p>
                <span className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-2 block opacity-0 group-hover:opacity-100 transition-opacity">Click to Vote</span>
              </button>

              <div className="flex items-center justify-center my-2">
                <div className="h-px bg-gray-100 w-full"></div>
                <span className="px-4 text-gray-300 font-black text-xs uppercase tracking-widest">OR</span>
                <div className="h-px bg-gray-100 w-full"></div>
              </div>

              <button
                onClick={() => handleVote('optionTwo')}
                className="group p-6 border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <p className="text-lg font-semibold text-gray-800 group-hover:text-blue-700">
                  {question.optionTwo.text}
                </p>
                <span className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-2 block opacity-0 group-hover:opacity-100 transition-opacity">Click to Vote</span>
              </button>
            </div>
          ) : (
            /* Results Interface */
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Results:</h3>
              
              {/* Option One Result */}
              <div className={`p-6 rounded-2xl border-2 transition-all relative ${userChoice === 'optionOne' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100'}`}>
                {userChoice === 'optionOne' && (
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">Your Choice</div>
                )}
                <p className={`text-lg font-bold mb-4 ${userChoice === 'optionOne' ? 'text-blue-900' : 'text-gray-800'}`}>{question.optionOne.text}</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-700" 
                    style={{ width: `${optOnePercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>{optOnePercent}%</span>
                  <span>{optOneVotes} {optOneVotes === 1 ? 'vote' : 'votes'}</span>
                </div>
              </div>

              {/* Option Two Result */}
              <div className={`p-6 rounded-2xl border-2 transition-all relative ${userChoice === 'optionTwo' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100'}`}>
                {userChoice === 'optionTwo' && (
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">Your Choice</div>
                )}
                <p className={`text-lg font-bold mb-4 ${userChoice === 'optionTwo' ? 'text-blue-900' : 'text-gray-800'}`}>{question.optionTwo.text}</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-4 rounded-full transition-all duration-700" 
                    style={{ width: `${optTwoPercent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>{optTwoPercent}%</span>
                  <span>{optTwoVotes} {optTwoVotes === 1 ? 'vote' : 'votes'}</span>
                </div>
              </div>

              <div className="pt-4 text-center">
                <p className="text-gray-400 text-sm font-medium italic">Total votes cast: {totalVotes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-blue-600 font-bold transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PollDetail;