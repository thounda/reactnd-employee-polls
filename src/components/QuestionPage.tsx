/**
 * FILE: QuestionPage.tsx
 * PATH: /src/components/QuestionPage.tsx
 * * DESCRIPTION:
 * This component represents the "Poll Detail" view in the "Employee Polls" application.
 * It serves two primary functions:
 * 1. Voting Interface: Displays two options as buttons if the authenticated user has not yet voted.
 * 2. Results Interface: Displays progress bars and vote statistics if the user has already voted.
 * * The component handles 404 states for invalid IDs and dynamically calculates 
 * percentages and vote counts for the UI.
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// --- START: Redux Action Imports ---
// We import handleAddAnswer from the questionsSlice to manage the voting process.
import { handleAddAnswer } from '../slices/questionsSlice';
// --- END: Redux Action Imports ---

import { RootState } from '../slices/types';

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Accessing global state for authenticated user, questions, and users dictionary
  const authedUser = useSelector((state: RootState) => state.authedUser.value);
  const users = useSelector((state: RootState) => state.users);
  const questions = useSelector((state: RootState) => state.questions);

  const question = id ? questions[id] : null;
  const author = question ? users[question.author] : null;

  /**
   * 404 FALLBACK LOGIC
   * If the question ID in the URL doesn't match any question in the Redux state, 
   * we display a 404 error page.
   */
  if (!question || !author) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center min-h-[50vh]">
        <h1 className="text-9xl font-black text-gray-200 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-800">Poll Not Found</p>
        <p className="text-gray-500 mt-2">The poll you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg active:transform active:scale-95"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Check participation status
  const hasVoted = authedUser ? !!users[authedUser].answers[question.id] : false;
  const myAnswer = authedUser ? users[authedUser].answers[question.id] : null;

  // Calculation of Poll Stats
  const votesOne = question.optionOne.votes.length;
  const votesTwo = question.optionTwo.votes.length;
  const totalVotes = votesOne + votesTwo;
  const percentOne = totalVotes > 0 ? Math.round((votesOne / totalVotes) * 100) : 0;
  const percentTwo = totalVotes > 0 ? Math.round((votesTwo / totalVotes) * 100) : 0;

  /**
   * HANDLE VOTE
   * START: Action Dispatch Logic
   * This function dispatches the thunk that saves the answer to the mock database
   * and updates both the Users and Questions slices in the store.
   */
  const handleVote = (answer: 'optionOne' | 'optionTwo') => {
    if (authedUser && id) {
      dispatch(handleAddAnswer({
        authedUser,
        qid: id,
        answer
      }) as any);
    }
  };
  // END: Action Dispatch Logic

  return (
    <div className="max-w-3xl mx-auto my-12 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
      {/* Poll Header with Author Info */}
      <div className="bg-indigo-600 px-8 py-4 flex items-center justify-between">
        <span className="text-indigo-100 font-medium">Poll Created By</span>
        <span className="text-white font-bold">{author.name}</span>
      </div>
      
      <div className="p-8 flex flex-col items-center gap-10">
        {/* Author Avatar */}
        <div className="relative">
          <img 
            src={author.avatarURL} 
            alt={author.name} 
            className="w-40 h-40 rounded-full border-8 border-gray-50 shadow-inner object-cover"
          />
        </div>

        <div className="w-full max-w-xl">
          <h3 className="text-4xl font-black text-gray-900 mb-10 text-center tracking-tight">
            Would You Rather...
          </h3>

          {!hasVoted ? (
            /* VOTING INTERFACE */
            <div className="grid grid-cols-1 gap-6">
              <button
                onClick={() => handleVote('optionOne')}
                className="group relative w-full py-6 px-8 bg-white border-2 border-indigo-500 text-indigo-600 font-black text-xl rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 shadow-md"
              >
                {question.optionOne.text}
                <div className="absolute inset-y-0 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-2xl">→</span>
                </div>
              </button>
              
              <div className="flex items-center gap-4 text-gray-300">
                <div className="h-[1px] bg-gray-200 flex-grow"></div>
                <span className="text-xs font-black tracking-widest uppercase">OR</span>
                <div className="h-[1px] bg-gray-200 flex-grow"></div>
              </div>

              <button
                onClick={() => handleVote('optionTwo')}
                className="group relative w-full py-6 px-8 bg-white border-2 border-indigo-500 text-indigo-600 font-black text-xl rounded-2xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300 shadow-md"
              >
                {question.optionTwo.text}
                <div className="absolute inset-y-0 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-2xl">→</span>
                </div>
              </button>
            </div>
          ) : (
            /* RESULTS INTERFACE */
            <div className="space-y-8">
              {/* Option One Stats */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${myAnswer === 'optionOne' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-4">
                  <p className="font-bold text-gray-800 text-xl flex-1">{question.optionOne.text}</p>
                  {myAnswer === 'optionOne' && (
                    <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm ml-4 whitespace-nowrap">Your Vote</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${percentOne}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-lg font-black text-indigo-600">{percentOne}%</span>
                  <span className="text-sm text-gray-500 font-bold">{votesOne} of {totalVotes} votes</span>
                </div>
              </div>

              {/* Option Two Stats */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${myAnswer === 'optionTwo' ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex justify-between items-start mb-4">
                  <p className="font-bold text-gray-800 text-xl flex-1">{question.optionTwo.text}</p>
                  {myAnswer === 'optionTwo' && (
                    <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm ml-4 whitespace-nowrap">Your Vote</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${percentTwo}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-lg font-black text-indigo-600">{percentTwo}%</span>
                  <span className="text-sm text-gray-500 font-bold">{votesTwo} of {totalVotes} votes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;