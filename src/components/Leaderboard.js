/**
 * FILE: Leaderboard.js
 * PURPOSE: 
 * This component displays a ranked list of users based on their activity in the "Would You Rather?" application.
 * * UPDATES: 
 * - Replaced '@' symbol with 'id:' prefix for user IDs.
 * - Confirmed local asset paths (/public/avatars/) are used for user images.
 */

import React from 'react';

// --- MOCK / FALLBACK LOGIC ---
// Using local paths as defined in your _DATA.js
const useSelector = (selectorFn) => {
  const mockState = {
    users: {
      sarahedo: {
        id: 'sarahedo',
        name: 'Sarah Edo',
        avatarURL: '/public/avatars/leaf.png',
        answers: { "8xf0y6ziyjabvozdd253nd": 'optionOne', "6ni6ok3ym7mf1p33lnez": 'optionTwo' },
        questions: ['8xf0y6ziyjabvozdd253nd', 'am8e62vn31q87tkas1y3']
      },
      tylermcginnis: {
        id: 'tylermcginnis',
        name: 'Tyler McGinnis',
        avatarURL: '/public/avatars/snow.png',
        answers: { "vthrdm985a262al8qx3p": 'optionOne' },
        questions: ['loxhs1bqm25b708cmbf3', 'vthrdm985a262al8qx3p']
      },
      johndoe: {
        id: 'johndoe',
        name: 'John Doe',
        avatarURL: '/public/avatars/sun.png',
        answers: { "6ni6ok3ym7mf1p33lnez": 'optionOne' },
        questions: []
      }
    }
  };
  
  try {
    if (typeof window !== 'undefined' && window.ReactRedux && window.ReactRedux.useSelector) {
      return window.ReactRedux.useSelector(selectorFn);
    }
  } catch (e) {
    // Fallback to mock data if Redux/Provider is missing
  }
  return selectorFn(mockState);
};

// --- SUB-COMPONENTS ---

/**
 * Avatar Component
 * Renders user's project-specific avatars from the /public/avatars/ directory.
 */
const Avatar = ({ url, name, size = "w-10 h-10" }) => {
  // Ensure we are using the correct relative path if the URL is just a filename
  const avatarPath = url && !url.startsWith('http') && !url.startsWith('/') 
    ? `/public/avatars/${url}` 
    : url;

  return (
    <img
      src={avatarPath}
      alt={name}
      className={`${size} rounded-full object-cover bg-slate-100 ring-2 ring-slate-100 shadow-sm`}
      onError={(e) => {
        // Fallback to a styled initial if the specific asset is missing
        e.target.onerror = null;
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`;
      }}
    />
  );
};

/**
 * RankBadge Component
 * Hexagonal SVG badge for the top 3 spots.
 */
const RankBadge = ({ rank }) => {
  const getColors = (r) => {
    if (r === 1) return { primary: '#FBBF24', secondary: '#FEF3C7', text: '#92400E' }; // Gold
    if (r === 2) return { primary: '#94A3B8', secondary: '#F1F5F9', text: '#334155' }; // Silver
    if (r === 3) return { primary: '#D97706', secondary: '#FFF7ED', text: '#7C2D12' }; // Bronze
    return { primary: '#CBD5E1', secondary: '#F8FAFC', text: '#64748B' }; // Others
  };

  const colors = getColors(rank);

  return (
    <div className="relative flex items-center justify-center w-9 h-9">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
        <path
          d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
          fill={colors.secondary}
          stroke={colors.primary}
          strokeWidth="6"
        />
        <text
          x="50"
          y="68"
          textAnchor="middle"
          fontSize="48"
          fontWeight="900"
          fill={colors.text}
          fontFamily="sans-serif"
        >
          {rank}
        </text>
      </svg>
    </div>
  );
};

// --- MAIN COMPONENT ---

const Leaderboard = () => {
  const users = useSelector((state) => state.users || {});

  const sortedUsers = Object.values(users)
    .map((user) => {
      const answered = user.answers ? Object.keys(user.answers).length : 0;
      const created = user.questions ? user.questions.length : 0;
      return {
        id: user.id,
        name: user.name,
        avatarURL: user.avatarURL,
        answeredCount: answered,
        createdCount: created,
        score: answered + created,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-14 text-center">
        <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
          Rankings
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">
          Community Hall of Fame
        </h2>
        <div className="h-1.5 w-20 bg-indigo-500 mx-auto rounded-full"></div>
      </header>

      <div className="bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 font-bold uppercase text-[10px] tracking-[0.2em] text-center text-slate-400 w-24">Rank</th>
                <th className="px-6 py-6 font-bold uppercase text-[10px] tracking-[0.2em] text-slate-400">User Details</th>
                <th className="px-6 py-6 font-bold uppercase text-[10px] tracking-[0.2em] text-center text-slate-400">Answered</th>
                <th className="px-6 py-6 font-bold uppercase text-[10px] tracking-[0.2em] text-center text-slate-400">Created</th>
                <th className="px-10 py-6 font-bold uppercase text-[10px] tracking-[0.2em] text-right text-slate-400">Total Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedUsers.map((user, index) => (
                <tr key={user.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                  <td className="px-10 py-8 whitespace-nowrap">
                    <div className="flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <RankBadge rank={index + 1} />
                    </div>
                  </td>
                  <td className="px-6 py-8 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar url={user.avatarURL} name={user.name} size="w-16 h-16" />
                      <div className="ml-6">
                        <div className="text-xl font-extrabold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                          {user.name}
                        </div>
                        {/* Updated @ to id: as requested */}
                        <div className="text-sm font-medium text-slate-400 tracking-wide mt-0.5">id: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 whitespace-nowrap text-center">
                    <div className="text-slate-600 font-bold bg-white border border-slate-200 px-4 py-1.5 rounded-2xl text-sm inline-block shadow-sm">
                      {user.answeredCount}
                    </div>
                  </td>
                  <td className="px-6 py-8 whitespace-nowrap text-center">
                    <div className="text-slate-600 font-bold bg-white border border-slate-200 px-4 py-1.5 rounded-2xl text-sm inline-block shadow-sm">
                      {user.createdCount}
                    </div>
                  </td>
                  <td className="px-10 py-8 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-center min-w-[3.5rem] h-14 rounded-2xl bg-slate-900 text-white font-black text-2xl px-5 shadow-lg shadow-slate-200 group-hover:bg-indigo-600 group-hover:shadow-indigo-200 transition-all duration-300 transform group-hover:-translate-y-1">
                      {user.score}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <p className="mt-10 text-center text-slate-400 text-xs font-medium tracking-wide uppercase">
        Scores = Questions Created + Questions Answered
      </p>
    </div>
  );
};

export default Leaderboard;