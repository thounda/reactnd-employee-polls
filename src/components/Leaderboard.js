/**
 * File: src/components/Leaderboard.js
 * Description: 
 * Displays a ranked list of users based on their activity.
 * * Logic:
 * 1. Ranking: Sum of answered questions and created questions.
 * 2. Sorting: Users are sorted in descending order based on the total score.
 * 3. UI: Premium card layout with clear metrics for each user.
 * 4. Highlighting: Top 3 users get visual badges (Gold, Silver, Bronze style).
 * * Fixes applied:
 * - Resolved 'react-redux' dependency mapping issues by ensuring standard import compatibility.
 */

import React from 'react';
import { useSelector } from 'react-redux';

const Leaderboard = () => {
  // Access users from our Redux state
  const users = useSelector((state) => state.users);

  // Transform user object into a sorted array based on activity
  const sortedUsers = Object.values(users || {})
    .map((user) => ({
      id: user.id,
      name: user.name,
      avatarURL: user.avatarURL,
      answeredCount: Object.keys(user.answers || {}).length,
      createdCount: (user.questions || []).length,
      total: Object.keys(user.answers || {}).length + (user.questions || []).length,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Leaderboard</h1>
        <p className="text-gray-500 mt-2 text-lg">Recognizing our most active community contributors.</p>
      </div>

      <div className="grid gap-8">
        {sortedUsers.map((user, index) => (
          <div 
            key={user.id} 
            className="bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row items-center p-8 gap-8 relative group"
          >
            {/* Rank Badge */}
            <div className={`absolute top-0 left-0 w-14 h-14 flex items-center justify-center font-black text-white rounded-br-2xl shadow-lg transition-transform group-hover:scale-110 ${
              index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : 
              index === 1 ? 'bg-gradient-to-br from-gray-200 to-gray-400' : 
              index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-500' : 'bg-blue-50 text-blue-600 shadow-none'
            }`}>
              {index + 1}
            </div>

            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <img 
                src={user.avatarURL} 
                alt={user.name} 
                className="w-28 h-28 rounded-3xl object-cover ring-8 ring-gray-50 group-hover:ring-blue-50 transition-all shadow-md"
              />
            </div>

            {/* Info Section */}
            <div className="flex-grow text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</h2>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mt-1">@{user.id}</p>
            </div>

            {/* Stats Grid */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 border-t sm:border-t-0 sm:border-l border-gray-100 pt-8 sm:pt-0 sm:pl-10">
              <div className="text-center">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Answered</p>
                <p className="text-2xl font-black text-gray-800">{user.answeredCount}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Created</p>
                <p className="text-2xl font-black text-gray-800">{user.createdCount}</p>
              </div>
              <div className="text-center bg-blue-600 px-8 py-3 rounded-2xl shadow-lg shadow-blue-100 transform group-hover:scale-105 transition-transform">
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest mb-1">Score</p>
                <p className="text-3xl font-black text-white">{user.total}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedUsers.length === 0 && (
        <div className="text-center py-32 bg-white border-2 border-dashed border-gray-100 rounded-[3rem]">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <p className="text-gray-400 font-bold text-xl">Waiting for participants...</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;