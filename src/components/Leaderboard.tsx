import React from 'react';

/**
 * FILE: src/components/Leaderboard.tsx
 * DESCRIPTION: 
 * Displays a high-fidelity ranked list of users based on community engagement.
 * Engagement score = (Number of Questions Answered) + (Number of Questions Created).
 */

interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: Record<string, string>;
  questions: string[];
}

interface RankedUser extends User {
  answered: number;
  created: number;
  total: number;
}

const Leaderboard: React.FC = () => {
  /**
   * Safe Redux Integration
   * We use a flexible selector to ensure compatibility across different environment setups.
   */
  let useSelector: <T>(selector: (state: any) => T) => T = (selector) => ({} as any);

  try {
    // @ts-ignore
    const reactRedux = require('react-redux');
    if (reactRedux) {
      useSelector = reactRedux.useSelector;
    }
  } catch (e) {
    // Fallback if react-redux is not available
  }

  const users = useSelector((state: any) => state.users || {});

  // Calculate scores and sort users descending by total points
  const sortedUsers: RankedUser[] = Object.values(users)
    .map((user: any) => {
      const typedUser = user as User;
      const answered = Object.keys(typedUser.answers || {}).length;
      const created = (typedUser.questions || []).length;
      return {
        ...typedUser,
        answered,
        created,
        total: answered + created
      };
    })
    .sort((a, b) => b.total - a.total);

  if (sortedUsers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 space-y-16 md:space-y-24">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-4 mb-2">
           <div className="w-12 h-[2px] bg-indigo-600/20 rounded-full"></div>
           <span className="text-indigo-600 font-black uppercase tracking-[0.4em] text-[10px]">Hall of Fame</span>
           <div className="w-12 h-[2px] bg-indigo-600/20 rounded-full"></div>
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 italic tracking-tighter uppercase leading-[0.8]">
          Leader<span className="text-indigo-600">board</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] max-w-sm mx-auto leading-relaxed">
          The definitive ranking of the most active contributors in the community.
        </p>
      </div>

      {/* Podium for Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 items-end px-4 max-w-5xl mx-auto pt-10">
        {sortedUsers.slice(0, 3).map((user, index) => {
          // Visual constants based on rank
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;

          // Desktop podium order: 2nd, 1st, 3rd
          const order = isFirst ? 'md:order-2' : isSecond ? 'md:order-1' : 'md:order-3';
          const height = isFirst ? 'h-80 md:h-[22rem]' : isSecond ? 'h-64 md:h-[18rem]' : 'h-56 md:h-[16rem]';
          const medalColor = isFirst ? 'bg-yellow-400' : isSecond ? 'bg-slate-300' : 'bg-orange-400';
          const ringColor = isFirst ? 'ring-yellow-400' : isSecond ? 'ring-slate-200' : 'ring-orange-200';

          return (
            <div key={user.id} className={`flex flex-col items-center space-y-6 ${order}`}>
              <div className="relative group">
                <div className={`absolute -inset-6 bg-gradient-to-tr ${isFirst ? 'from-yellow-400 to-amber-600' : 'from-slate-400 to-slate-600'} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition duration-1000`}></div>
                
                <div className={`relative ${isFirst ? 'w-36 h-36' : 'w-28 h-28'} rounded-full p-1.5 bg-white shadow-2xl ring-4 ${ringColor} transition-transform duration-500 group-hover:scale-105`}>
                  <img 
                    src={user.avatarURL} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover bg-slate-50"
                    onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`)}
                  />
                </div>

                <div className={`absolute -bottom-2 -right-2 w-12 h-12 ${medalColor} rounded-2xl border-4 border-white flex items-center justify-center font-black text-white text-lg shadow-xl rotate-12 group-hover:rotate-0 transition-transform`}>
                  {index + 1}
                </div>
              </div>
              
              <div className={`w-full ${height} bg-white rounded-t-[3rem] shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.05)] border-x border-t border-slate-100 p-8 flex flex-col items-center justify-between text-center relative overflow-hidden group`}>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                
                <div className="pt-2">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl leading-tight truncate w-full px-2">{user.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 opacity-60">@{user.id}</p>
                </div>
                
                <div className="space-y-0">
                  <div className={`font-black text-slate-900 tracking-tighter italic ${isFirst ? 'text-7xl' : 'text-6xl'}`}>{user.total}</div>
                  <div className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em]">Total Points</div>
                </div>

                <div className="w-full pt-6 border-t border-slate-50 flex justify-around text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <div className="flex flex-col items-center">
                    <span className="text-slate-900 text-sm mb-0.5">{user.answered}</span>
                    <span className="text-[8px] opacity-60">Votes</span>
                  </div>
                  <div className="flex flex-col items-center border-l border-slate-50 pl-6">
                    <span className="text-slate-900 text-sm mb-0.5">{user.created}</span>
                    <span className="text-[8px] opacity-60">Polls</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Others List (Rank 4+) */}
      {sortedUsers.length > 3 && (
        <div className="bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Rank</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contributor</th>
                  <th className="px-10 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Votes</th>
                  <th className="px-10 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Polls</th>
                  <th className="px-10 py-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedUsers.slice(3).map((user, index) => (
                  <tr key={user.id} className="group hover:bg-indigo-50/30 transition-colors">
                    <td className="px-10 py-7">
                      <span className="font-black text-slate-300 group-hover:text-indigo-600 transition-colors text-xl italic">
                        #{index + 4}
                      </span>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center space-x-5">
                        <div className="relative">
                          <img 
                            src={user.avatarURL} 
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all shadow-sm" 
                            alt={user.name} 
                            onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`)}
                          />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 uppercase text-sm tracking-tight">{user.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 tracking-wider">@{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-center font-black text-slate-600 group-hover:text-slate-900 tabular-nums">{user.answered}</td>
                    <td className="px-10 py-7 text-center font-black text-slate-600 group-hover:text-slate-900 tabular-nums">{user.created}</td>
                    <td className="px-10 py-7 text-right">
                      <span className="inline-block min-w-[3rem] px-5 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest group-hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 group-hover:shadow-indigo-100/50 italic tabular-nums">
                        {user.total}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;