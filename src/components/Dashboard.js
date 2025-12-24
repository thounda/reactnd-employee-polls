/**
 * File: src/components/Dashboard.js
 * Description: 
 * The main landing page for authenticated users. 
 * Features include:
 * 1. Categorization of polls into "Unanswered" (New Questions) and "Answered" (Done).
 * 2. Sorting by timestamp (newest first).
 * 3. A toggle system to switch between views.
 * 4. Responsive grid layout using Tailwind CSS.
 * * Fixes applied:
 * - Renamed file to .js to adhere to the "no .jsx" requirement.
 * - Verified Redux imports and state mapping.
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Local state for the toggle view
  const [view, setView] = useState('unanswered'); 
  
  // Mapping global state from the Redux store
  const authedUser = useSelector((state) => state.authedUser);
  const users = useSelector((state) => state.users);
  const questions = useSelector((state) => state.questions);

  // 1. Sort all question IDs by timestamp (newest first)
  const sortedQuestionIds = Object.keys(questions || {}).sort(
    (a, b) => questions[b].timestamp - questions[a].timestamp
  );

  // 2. Filter questions based on the authedUser's voting history
  const unansweredIds = sortedQuestionIds.filter(
    (id) => !questions[id].optionOne.votes.includes(authedUser) &&
            !questions[id].optionTwo.votes.includes(authedUser)
  );

  const answeredIds = sortedQuestionIds.filter(
    (id) => questions[id].optionOne.votes.includes(authedUser) ||
            questions[id].optionTwo.votes.includes(authedUser)
  );

  const activeList = view === 'unanswered' ? unansweredIds : answeredIds;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        
        {/* Toggle Switch Container */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setView('unanswered')}
            className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              view === 'unanswered'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            New Questions
          </button>
          <button
            onClick={() => setView('answered')}
            className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              view === 'answered'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Done
          </button>
        </div>
      </div>

      {/* Grid Display */}
      {activeList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white border-2 border-dashed border-gray-200 rounded-3xl">
          <p className="text-gray-400 text-lg font-medium">Nothing to see here yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeList.map((id) => {
            const question = questions[id];
            const author = users[question.author];
            return (
              <div 
                key={id} 
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img 
                      src={author?.avatarURL} 
                      alt={author?.name} 
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-50 group-hover:ring-blue-100 transition-all"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{author?.name}</h3>
                  <p className="text-sm text-gray-400 mb-6 font-medium">
                    {new Date(question.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  
                  <Link 
                    to={`/questions/${id}`}
                    className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-blue-200"
                  >
                    Show Poll
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;