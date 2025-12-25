/**
 * File: src/components/Leaderboard.js
 * Description: Renders a ranked list of users based on questions asked and answered.
 * * NOTE: The "Could not resolve" error in this preview panel is expected.
 * This component relies on the 'react-redux' library and a global store 
 * which are present in your local project but not in this preview environment.
 */

import React from 'react';
import { useSelector } from 'react-redux';

// Inline SVGs to maintain consistency and avoid dependency issues
const IconMedal = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8a2 2 0 0 1 2.2-.13L14.47 7.3"/><path d="M16.79 15 21.34 7.14a2 2 0 0 0-.13-2.2L19.6 2.8a2 2 0 0 0-2.2-.13L9.53 7.3"/><path d="M15 21a3 3 0 0 0-3-3 3 3 0 0 0-3 3"/><circle cx="12" cy="13" r="8"/></svg>
);

const Leaderboard = () => {
  // Accessing users from Redux state
  const users = useSelector((state) => state.users);

  // Transform user data into a ranked list
  const sortedUsers = Object.values(users || {})
    .map((user) => ({
      id: user.id,
      name: user.name,
      avatarURL: user.avatarURL,
      answered: Object.keys(user.answers || {}).length,
      created: (user.questions || []).length,
      total: Object.keys(user.answers || {}).length + (user.questions || []).length,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Leaderboard</h2>
        <p className="text-gray-500 text-sm">Recognizing our most active poll participants.</p>
      </div>

      <div className="space-y-4">
        {sortedUsers.map((user, index) => {
          const isTopThree = index < 3;
          const medalColors = ['#F59E0B', '#94A3B8', '#B45309']; // Gold, Silver, Bronze

          return (
            <div 
              key={user.id} 
              className={`relative bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center transition-all hover:shadow-md ${
                index === 0 ? 'ring-2 ring-amber-400 ring-offset-4' : ''
              }`}
            >
              {/* Rank Badge */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-lg">
                {index + 1}
              </div>

              <div className="flex flex-col sm:flex-row items-center flex-1 gap-6 ml-4">
                <img 
                  src={user.avatarURL} 
                  alt={user.name} 
                  className="w-20 h-20 rounded-2xl bg-slate-50 border-4 border-white shadow-sm"
                />
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mt-1">@{user.id}</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                    <div className="text-center px-4 py-2 bg-slate-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Answered</p>
                      <p className="text-lg font-black text-indigo-600">{user.answered}</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-slate-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Created</p>
                      <p className="text-lg font-black text-indigo-600">{user.created}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center px-8 border-l border-gray-100 sm:min-w-[120px]">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Score</p>
                  <div className="relative">
                    <span className="text-4xl font-black text-gray-900">{user.total}</span>
                    {isTopThree && (
                      <div className="absolute -right-8 top-0">
                        <IconMedal color={medalColors[index]} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;