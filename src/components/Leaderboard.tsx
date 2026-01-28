import React from 'react';

/**
 * FILE: src/components/Leaderboard.tsx
 * DESCRIPTION: 
 * Displays a ranked list of users based on their engagement.
 * Engagement score = (Number of Questions Answered) + (Number of Questions Created).
 * Enhanced with a high-end podium UI and responsive ranking table.
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
  // Safely access Redux hooks from the global window object
  const useSelector = (window as any).ReactRedux?.useSelector || (() => ({}));
  
  // Access state with flexible typing for resilience
  const users: Record<string, User> = useSelector((state: any) => state.app?.users || state.users || {});

  // Calculate scores and sort users descending
  const sortedUsers: RankedUser[] = Object.values(users)
    .map((user) => {
      const answered = Object.keys(user.answers || {}).length;
      const created = (user.questions || []).length;
      return {
        ...user,
        answered,
        created,
        total: answered + created
      };
    })
    .sort((a, b) => b.total - a.total);

  if (sortedUsers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 space-y-20">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-2">
           <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
           <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px]">Hall of Fame</span>
           <div className="w-8 h-1 bg-indigo-600 rounded-full"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
          Leaderboard
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs max-w-lg mx-auto">
          Recognizing the top decision-makers of our community
        </p>
      </div>

      {/* Podium for Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end px-4 max-w-5xl mx-auto pt-10">
        {sortedUsers.slice(0, 3).map((user, index) => {
          // Podium order for desktop: 2nd, 1st, 3rd
          const order = index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3';
          const height = index === 0 ? 'h-80' : index === 1 ? 'h-64' : 'h-56';
          const medalColor = index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : 'bg-orange-400';
          const shadowColor = index === 0 ? 'shadow-yellow-200/50' : index === 1 ? 'shadow-slate-200/50' : 'shadow-orange-200/50';

          return (
            <div key={user.id} className={`flex flex-col items-center space-y-6 ${order}`}>
              <div className="relative group">
                <div className={`absolute -inset-4 bg-gradient-to-tr ${index === 0 ? 'from-yellow-400 to-amber-600' : 'from-slate-400 to-slate-600'} rounded-full blur-xl opacity-0 group-hover:opacity-20 transition duration-700`}></div>
                
                <div className={`relative ${index === 0 ? 'w-32 h-32' : 'w-24 h-24'} rounded-full p-1 bg-white shadow-xl ring-4 ${index === 0 ? 'ring-yellow-400' : 'ring-slate-100'}`}>
                  <img 
                    src={user.avatarURL} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`)}
                  />
                </div>

                <div className={`absolute -bottom-2 -right-2 w-12 h-12 ${medalColor} rounded-2xl border-4 border-white flex items-center justify-center font-black text-white text-lg shadow-xl ${shadowColor} rotate-12 group-hover:rotate-0 transition-transform`}>
                  {index + 1}
                </div>
              </div>
              
              <div className={`w-full ${height} bg-white rounded-t-[3rem] shadow-2xl border-x border-t border-slate-100 p-8 flex flex-col items-center justify-between text-center relative overflow-hidden group`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                
                <div className="pt-2">
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-lg leading-tight truncate w-full">{user.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">@{user.id}</p>
                </div>
                
                <div className="space-y-0">
                  <div className="text-6xl font-black text-slate-900 tracking-tighter italic">{user.total}</div>
                  <div className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em]">Total Points</div>
                </div>

                <div className="w-full pt-6 border-t border-slate-50 flex justify-around text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <div className="flex flex-col items-center">
                    <span className="text-slate-900 text-sm">{user.answered}</span>
                    <span className="text-[8px] opacity-70">Votes</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-slate-900 text-sm">{user.created}</span>
                    <span className="text-[8px] opacity-70">Polls</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Others List (Rank 4+) */}
      {sortedUsers.length > 3 && (
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 border border-slate-100 overflow-hidden max-w-5xl mx-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Rank</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">User</th>
                  <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Votes</th>
                  <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Polls</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sortedUsers.slice(3).map((user, index) => (
                  <tr key={user.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-10 py-6">
                      <span className="font-black text-slate-300 group-hover:text-indigo-600 transition-colors text-lg italic">
                        #{index + 4}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-5">
                        <img 
                          src={user.avatarURL} 
                          className="w-12 h-12 rounded-full ring-2 ring-slate-100" 
                          alt={user.name} 
                          onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`)}
                        />
                        <div>
                          <div className="font-black text-slate-900 uppercase text-sm tracking-tight">{user.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 tracking-wider">@{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center font-black text-slate-600 group-hover:text-slate-900">{user.answered}</td>
                    <td className="px-10 py-6 text-center font-black text-slate-600 group-hover:text-slate-900">{user.created}</td>
                    <td className="px-10 py-6 text-right">
                      <span className="inline-block px-5 py-2 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest group-hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200 group-hover:shadow-indigo-100">
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