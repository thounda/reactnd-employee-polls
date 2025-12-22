/**
 * File: src/components/Leaderboard.js
 * Description: A React component that renders a high-performance, responsive 
 * leaderboard table for the "Would You Rather" application. It calculates 
 * user scores based on questions created and polls answered, sorts them 
 * descending, and displays them with custom branding.
 * * Features:
 * - Decoupled logic for modular imports.
 * - Explicit 'id: ' prefix for user identifiers.
 * - Dynamic ranking styles for top 3 positions.
 * - Robust avatar rendering with DiceBear fallbacks.
 */

import React from 'react';

const Leaderboard = ({ users = {} }) => {
  // Sort users based on total activity: sum of answers and questions
  const sortedUsers = Object.values(users).sort((a, b) => {
    const aTotal = Object.keys(a.answers).length + a.questions.length;
    const bTotal = Object.keys(b.answers).length + b.questions.length;
    return bTotal - aTotal;
  });

  // Helper to apply specific thematic styling to the top 3 leaderboard spots
  const getRankStyle = (index) => {
    switch (index) {
      case 0: return "bg-yellow-50 border-yellow-200 text-yellow-700"; // Gold
      case 1: return "bg-slate-50 border-slate-200 text-slate-500";   // Silver
      case 2: return "bg-orange-50 border-orange-200 text-orange-700"; // Bronze
      default: return "bg-white border-gray-100 text-gray-400";
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header Section */}
      <div className="p-8 border-b border-gray-50 bg-gray-50/50">
        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
          Global Rankings
        </h2>
      </div>
      
      {/* Scrollable Table Wrapper for Mobile Support */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">
              <th className="px-8 py-4 font-bold text-center w-20">Rank</th>
              <th className="px-8 py-4 font-bold">User Information</th>
              <th className="px-8 py-4 font-bold text-center">Answered</th>
              <th className="px-8 py-4 font-bold text-center">Created</th>
              <th className="px-8 py-4 font-bold text-right">Total Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedUsers.map((user, index) => {
              const answeredCount = Object.keys(user.answers).length;
              const createdCount = user.questions.length;
              const totalScore = answeredCount + createdCount;

              return (
                <tr key={user.id} className="group hover:bg-indigo-50/30 transition-colors">
                  {/* Rank Indicator */}
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs font-black shadow-sm mx-auto ${getRankStyle(index)}`}>
                      {index + 1}
                    </div>
                  </td>

                  {/* Identity Column */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={user.avatarURL} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                        onError={(e) => {
                          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
                        }}
                      />
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</div>
                        {/* Requirement: Prepend 'id: ' to the ID string */}
                        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                          id: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Metrics Columns */}
                  <td className="px-8 py-6 text-center font-bold text-gray-600">
                    {answeredCount}
                  </td>
                  <td className="px-8 py-6 text-center font-bold text-gray-600">
                    {createdCount}
                  </td>

                  {/* Score Column */}
                  <td className="px-8 py-6 text-right">
                    <span className="inline-block px-4 py-1 rounded-full bg-indigo-600 text-white text-sm font-black shadow-lg shadow-indigo-200">
                      {totalScore}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;