/**
 * File: src/components/PollDetail.js
 * Description: Displays a single poll question. Renders either the answering form
 * or the results, depending on whether the authenticated user has answered the poll.
 */
import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import UnansweredPoll from './UnansweredPoll.js'; // To be created
import AnsweredPoll from './AnsweredPoll.js'; // To be created
import NotFound from './NotFound.js'; // Use the existing 404 component

function PollDetail({ question, author, authedUser, isAnswered }) {
  // Get the question_id from the URL parameters
  const { question_id } = useParams();

  // 1. Check if the question exists. If not, render the 404 page.
  if (!question) {
    return <NotFound />;
  }

  // Determine the display title and author info
  const authorName = author?.name || 'Unknown User';
  const authorAvatar = author?.avatarURL || 'https://placehold.co/100x100/A5B4FC/ffffff?text=User';

  return (
    <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
      {/* Header showing who asked the question */}
      <div className="bg-indigo-600 p-4 text-white text-center">
        <h2 className="text-xl font-semibold">{authorName} asks:</h2>
      </div>

      <div className="p-6 flex flex-col items-center">
        {/* Author Avatar */}
        <img
          src={authorAvatar}
          alt={`Avatar of ${authorName}`}
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 mb-4"
        />

        <h1 className="text-3xl font-bold text-gray-800 mb-6">Would You Rather...</h1>
        
        {/* Conditional Rendering based on answer status */}
        {isAnswered ? (
          // If answered, show the results component
          <AnsweredPoll question={question} authedUser={authedUser} />
        ) : (
          // If unanswered, show the form component
          <UnansweredPoll question={question} authedUser={authedUser} />
        )}
      </div>
    </div>
  );
}

/**
 * Maps state to props for PollDetail.
 */
function mapStateToProps({ questions, users, authedUser }, props) {
  // Use the question_id from the URL params to find the question
  // Note: We access the router params via the connect's second argument (ownProps)
  // but since we are using useParams hook, we don't strictly need ownProps here, 
  // but connect must return a valid mapStateToProps function.
  const { question_id } = useParams(); 
  const question = questions[question_id];
  
  // If the question doesn't exist, we return minimal props; NotFound handles the rest.
  if (!question) {
    return {
      question: null,
      author: null,
      authedUser,
      isAnswered: false,
    };
  }

  const author = users[question.author];
  const isAnswered = users[authedUser]?.answers?.[question_id] !== undefined;

  return {
    question,
    author,
    authedUser,
    isAnswered,
  };
}

// Due to React Router v6 hooks, we need a wrapper component to use connect correctly.
// connect() wraps the component and receives dispatch, but we manually inject state via the component body hook (useParams).
const ConnectedPollDetail = (props) => {
    // We use the raw component and rely on the local hook (useParams) inside it.
    // We pass the Redux state down via props, and let PollDetail use useParams internally.
    return <PollDetail {...props} />;
};


export default connect(mapStateToProps)(ConnectedPollDetail);