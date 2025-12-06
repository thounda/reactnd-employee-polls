/**
 * File: src/components/Dashboard.js
 * Description: The main application dashboard (Home page).
 * This component displays two lists: unanswered polls and answered polls, using tabs.
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PollCard from './PollCard.js';

function Dashboard() {
  // Get all necessary data from the Redux store
  const authedUserId = useSelector((state) => state.authedUser);
  const questions = useSelector((state) => state.questions);
  const user = useSelector((state) => state.users[authedUserId]);
  
  // Local state to manage the active tab ('unanswered' or 'answered')
  const [activeTab, setActiveTab] = useState('unanswered');

  // --- Logic to Categorize Questions ---

  // 1. Get the IDs of questions the user has already answered/voted on
  const answeredQuestionIds = Object.keys(user.answers);

  // 2. Get all question IDs, sorted by timestamp (newest first)
  const sortedQuestionIds = Object.keys(questions).sort(
    (a, b) => questions[b].timestamp - questions[a].timestamp
  );

  // 3. Separate questions into two lists
  const unansweredQuestionIds = sortedQuestionIds.filter(
    (qid) => !answeredQuestionIds.includes(qid)
  );

  const answeredQuestionIdsSorted = sortedQuestionIds.filter(
    (qid) => answeredQuestionIds.includes(qid)
  );

  // Determine which list to display based on the active tab
  const displayQuestionIds =
    activeTab === 'unanswered' ? unansweredQuestionIds : answeredQuestionIdsSorted;

  // --- Utility Functions ---

  // Helper function for styling the tabs
  const tabClassName = (tab) =>
    `flex-1 py-3 px-4 text-lg font-semibold rounded-t-lg transition-colors duration-200 cursor-pointer ${
      activeTab === tab
        ? 'bg-white text-indigo-700 border-b-4 border-indigo-600'
        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
    }`;

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header and Tabs */}
      <div className="bg-white rounded-t-xl shadow-md overflow-hidden">
        <h2 className="text-3xl font-bold text-indigo-700 pt-6 pb-2 text-center">
          Employee Poll Dashboard
        </h2>
        <div className="flex border-b border-gray-200 mt-4">
          <div
            className={tabClassName('unanswered')}
            onClick={() => setActiveTab('unanswered')}
          >
            Unanswered Polls ({unansweredQuestionIds.length})
          </div>
          <div
            className={tabClassName('answered')}
            onClick={() => setActiveTab('answered')}
          >
            Answered Polls ({answeredQuestionIdsSorted.length})
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-4 bg-gray-50 rounded-b-xl shadow-2xl">
        {displayQuestionIds.length === 0 ? (
          <div className="p-8 text-center text-xl text-gray-600 bg-white rounded-lg border border-gray-200">
            {activeTab === 'unanswered'
              ? "Congratulations! You've answered every poll."
              : "You haven't answered any polls yet. Go vote!"}
          </div>
        ) : (
          <div className="space-y-6">
            {displayQuestionIds.map((qid) => (
              <PollCard key={qid} qid={qid} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;