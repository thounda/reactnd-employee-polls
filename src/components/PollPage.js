/**
 * File: src/components/PollPage.js
 * Description: The main container for displaying a single poll.
 * It determines if the user has answered the poll and displays the appropriate
 * component (voting form or results).
 */
import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Avatar from './Avatar.js';
import UnansweredPoll from './UnansweredPoll.js';
import Error404 from './Error404.js'; 

// Component to display poll results once answered
function AnsweredPollResults({ question, author, authedUserAnswer }) {
  // --- Results Logic ---
  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;

  const getVotePercentage = (option) => {
    const votes = question[option].votes.length;
    // Prevent division by zero and ensure a clean percentage
    return totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
  };
  
  const optionOneVotes = question.optionOne.votes.length;
  const optionTwoVotes = question.optionTwo.votes.length;

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg mx-auto">
      {/* Author Header */}
      <div className="bg-gray-100 p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          {author.name} asked:
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
          Results
        </h1>

        {/* Option One Results Card */}
        <div className={`p-4 rounded-lg border-2 relative ${authedUserAnswer === 'optionOne' ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-200 bg-gray-50'}`}>
          {authedUserAnswer === 'optionOne' && (
            <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl shadow-md">
              Your Vote
            </span>
          )}
          <p className="text-lg font-medium mb-2 text-gray-700">
            Would you rather {question.optionOne.text}?
          </p>
          <div className="h-6 bg-gray-200 rounded-full mb-1 overflow-hidden">
            <div 
              className="h-6 bg-indigo-600 transition-all duration-500" 
              style={{ width: `${getVotePercentage('optionOne')}%` }}
              title={`${optionOneVotes} votes (${getVotePercentage('optionOne')}%)`}
            ></div>
          </div>
          <div className="flex justify-between text-sm font-semibold text-gray-600 mt-1">
            <span>{optionOneVotes} out of {totalVotes} votes</span>
            <span className="text-indigo-800">{getVotePercentage('optionOne')}%</span>
          </div>
        </div>

        {/* Option Two Results Card */}
        <div className={`p-4 rounded-lg border-2 relative ${authedUserAnswer === 'optionTwo' ? 'border-green-500 bg-green-50 shadow-lg' : 'border-gray-200 bg-gray-50'}`}>
          {authedUserAnswer === 'optionTwo' && (
            <span className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl shadow-md">
              Your Vote
            </span>
          )}
          <p className="text-lg font-medium mb-2 text-gray-700">
            Would you rather {question.optionTwo.text}?
          </p>
          <div className="h-6 bg-gray-200 rounded-full mb-1 overflow-hidden">
            <div 
              className="h-6 bg-indigo-600 transition-all duration-500" 
              style={{ width: `${getVotePercentage('optionTwo')}%` }}
              title={`${optionTwoVotes} votes (${getVotePercentage('optionTwo')}%)`}
            ></div>
          </div>
          <div className="flex justify-between text-sm font-semibold text-gray-600 mt-1">
            <span>{optionTwoVotes} out of {totalVotes} votes</span>
            <span className="text-indigo-800">{getVotePercentage('optionTwo')}%</span>
          </div>
        </div>
        
        <div className="text-center pt-4">
          <Avatar url={author.avatarURL} name={author.name} size="w-16 h-16 border-4 border-indigo-400 mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Poll Author: {author.name}</p>
        </div>
      </div>
    </div>
  );
}


function PollPage() {
  // Get question ID from URL
  const { id: qid } = useParams();

  // Get necessary data from Redux store
  const authedUser = useSelector((state) => state.authedUser);
  const questions = useSelector((state) => state.questions);
  const users = useSelector((state) => state.users);

  const question = questions[qid];
  
  // 1. Check for Invalid Question ID (404)
  if (!question) {
    return <Error404 />;
  }

  const author = users[question.author];
  const userAnswers = users[authedUser]?.answers || {};
  
  // 2. Check if the user has answered this question
  const authedUserAnswer = userAnswers[qid]; // Will be 'optionOne', 'optionTwo', or undefined

  return (
    <div className="min-h-full py-8">
      {authedUserAnswer ? (
        // RENDER RESULTS
        <AnsweredPollResults 
          question={question} 
          author={author} 
          authedUserAnswer={authedUserAnswer}
        />
      ) : (
        // RENDER VOTING FORM
        <UnansweredPoll 
          question={question} 
          author={author} 
        />
      )}
    </div>
  );
}

export default PollPage;