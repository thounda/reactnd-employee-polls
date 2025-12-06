/**
 * File: src/components/Leaderboard.js
 * Description: Component that displays a ranked list of users based on their scores
 * (questions asked + questions answered).
 */
import React from 'react';
import { useSelector } from 'react-redux';
import Avatar from './Avatar.js';

function Leaderboard() {
  // Fetch all users from the Redux store
  const users = useSelector((state) => state.users);

  // 1. Calculate scores and transform the users object into a sortable array
  const leaderboardData = Object.values(users)
    .map((user) => ({
      id: user.id,
      name: user.name,
      avatarURL: user.avatarURL,
      questionsAsked: user.questions.length,
      questionsAnswered: Object.keys(user.answers).length,
      // Score = Questions Asked + Questions Answered
      score: user.questions.length + Object.keys(user.answers).length,
    }))
    // 2. Sort the array: highest score first, then by questions answered (tie-breaker)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.questionsAnswered - a.questionsAnswered;
    });
    
  // Helper to determine ribbon color/style for top ranks
  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return 'bg-yellow-500 text-white shadow-xl ring-4 ring-yellow-200'; // Gold
      case 1:
        return 'bg-gray-400 text-white shadow-lg ring-4 ring-gray-200'; // Silver
      case 2:
        return 'bg-yellow-800 text-white shadow-md ring-4 ring-yellow-300'; // Bronze
      default:
        return 'bg-white text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center">
        Employee Leaderboard
      </h2>

      <div className="space-y-4">
        {leaderboardData.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center p-6 rounded-xl transition duration-300 transform hover:scale-[1.01] ${getRankStyle(index)}`}
          >
            {/* Rank Indicator */}
            <div className="w-12 text-center mr-6">
              <span className="text-3xl font-black">{index + 1}</span>
            </div>

            {/* Avatar & Name */}
            <div className="flex items-center space-x-4 flex-grow">
              <Avatar url={user.avatarURL} name={user.name} size="w-16 h-16" />
              <span className="text-2xl font-bold">{user.name}</span>
            </div>

            {/* Statistics */}
            <div className="flex space-x-8 text-center text-lg font-medium border-l border-opacity-30 border-current pl-8">
              
              {/* Answered */}
              <div>
                <p className="text-sm opacity-80">Answered</p>
                <p className="text-3xl font-extrabold">{user.questionsAnswered}</p>
              </div>

              {/* Asked */}
              <div>
                <p className="text-sm opacity-80">Asked</p>
                <p className="text-3xl font-extrabold">{user.questionsAsked}</p>
              </div>

              {/* Total Score */}
              <div className="text-indigo-700 bg-indigo-100 px-4 py-2 rounded-lg shadow-inner">
                <p className="text-sm font-semibold">Total Score</p>
                <p className="text-3xl font-extrabold">{user.score}</p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;