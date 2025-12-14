/**
 * File: src/components/Leaderboard.js
 * Description: Displays a ranked list of users based on questions asked and answered.
 */
import React from 'react';
import { connect } from 'react-redux';

function Leaderboard({ rankedUsers }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
        Leaderboard
      </h1>
      
      {rankedUsers.map((user, index) => {
        const questionsAnswered = Object.keys(user.answers).length;
        const questionsCreated = user.questions.length;
        const totalScore = questionsAnswered + questionsCreated;
        const rank = index + 1;

        // Determine badge color based on rank
        let badgeColor = 'bg-gray-400';
        if (rank === 1) badgeColor = 'bg-yellow-500';
        else if (rank === 2) badgeColor = 'bg-gray-300';
        else if (rank === 3) badgeColor = 'bg-yellow-700';
        
        return (
          <div
            key={user.id}
            className="flex items-center bg-white shadow-xl rounded-xl p-6 border-l-8 border-indigo-600 relative overflow-hidden transition duration-300 hover:shadow-2xl"
          >
            {/* Rank Badge */}
            <div className={`absolute top-0 right-0 p-2 px-4 rounded-bl-xl text-white font-bold text-lg ${badgeColor}`}>
              #{rank}
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0 mr-6">
              <img
                src={user.avatarURL}
                alt={`Avatar of ${user.name}`}
                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-200"
              />
            </div>

            {/* User Info and Stats */}
            <div className="flex-grow">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {user.name}
              </h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Answered Polls:</span>
                  <span className="font-semibold text-indigo-700">{questionsAnswered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Created Polls:</span>
                  <span className="font-semibold text-indigo-700">{questionsCreated}</span>
                </div>
              </div>
            </div>

            {/* Score Card */}
            <div className="ml-8 flex-shrink-0 bg-indigo-100 p-4 rounded-lg text-center shadow-inner">
              <span className="block text-sm font-medium text-indigo-800 mb-1">Score</span>
              <span className="block text-3xl font-extrabold text-indigo-900">
                {totalScore}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Maps state to props, calculating and sorting the user data for the leaderboard.
 */
function mapStateToProps({ users }) {
  // Convert users object to an array for sorting
  const usersArray = Object.values(users);

  // Calculate score for each user and sort in descending order
  const rankedUsers = usersArray
    .map(user => ({
      ...user,
      score: Object.keys(user.answers).length + user.questions.length,
    }))
    .sort((a, b) => b.score - a.score); // Sort descending by score

  return {
    rankedUsers,
  };
}

export default connect(mapStateToProps)(Leaderboard);