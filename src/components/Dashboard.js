/**
 * File: src/components/Dashboard.js
 * Description: The main component displaying lists of answered and unanswered polls.
 */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PollCard from './PollCard.js'; // We will create this component next

function Dashboard({ authedUser, questions, users }) {
  // State to manage which tab is currently active ('unanswered' or 'answered')
  const [activeTab, setActiveTab] = useState('unanswered');

  // 1. Get IDs of questions answered by the current user
  const answeredQids = Object.keys(users[authedUser]?.answers || {});

  // 2. Filter questions into two lists based on the current user's answers
  const unansweredQuestions = Object.keys(questions)
    .filter((id) => !answeredQids.includes(id)) // Questions not in the answered list
    .sort((a, b) => questions[b].timestamp - questions[a].timestamp); // Sort by newest first

  const answeredQuestions = Object.keys(questions)
    .filter((id) => answeredQids.includes(id)) // Questions in the answered list
    .sort((a, b) => questions[b].timestamp - questions[a].timestamp); // Sort by newest first

  // Determine which list to display based on the active tab
  const displayQuestions = activeTab === 'unanswered' 
    ? unansweredQuestions 
    : answeredQuestions;

  // Helper function to render a single tab button
  const renderTabButton = (tabName, questionCount) => {
    const isActive = activeTab === tabName;
    const commonClasses = "px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-4";
    const activeClasses = "border-indigo-600 text-indigo-700 bg-indigo-50";
    const inactiveClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300";

    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`${commonClasses} ${isActive ? activeClasses : inactiveClasses}`}
        aria-selected={isActive}
        role="tab"
      >
        {tabName.charAt(0).toUpperCase() + tabName.slice(1)} Polls ({questionCount})
      </button>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex justify-start border-b border-gray-200 bg-gray-50" role="tablist">
        {renderTabButton('unanswered', unansweredQuestions.length)}
        {renderTabButton('answered', answeredQuestions.length)}
      </div>

      {/* Poll List Content */}
      <div className="p-4 sm:p-6 space-y-4" role="tabpanel" aria-labelledby={`${activeTab}-tab`}>
        {displayQuestions.length > 0 ? (
          displayQuestions.map((id) => (
            // Pass the question ID to the PollCard component
            <PollCard key={id} questionId={id} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            {activeTab === 'unanswered'
              ? "Congratulations! You have answered all available polls."
              : "You haven't answered any polls yet. Go answer some!"}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Maps the necessary state slices to the Dashboard component props.
 * @param {Object} state - The Redux store state.
 * @returns {Object} Props containing authedUser, questions, and users.
 */
function mapStateToProps({ authedUser, questions, users }) {
  // We need all three slices to determine which questions are answered/unanswered
  return {
    authedUser,
    questions,
    users,
  };
}

export default connect(mapStateToProps)(Dashboard);