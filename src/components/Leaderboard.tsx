import React from 'react';

// VS CODE USERS: Uncomment these imports in your local project
import { useAppSelector } from '../store/hooks'; 

/**
 * FILE: src/components/Leaderboard.tsx
 * DESCRIPTION: 
 * Displays a high-fidelity ranked list of users based on community engagement.
 * Features a visual podium for the Top 3 and an analytical breakdown for the community.
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

  const users = useAppSelector((state: any) => {
    const root = state.app || state;
    return root.users || {};
  });

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
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-8 border-indigo-50 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Calculating Rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 space-y-16 md:space-y-28 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header Section */}
      <div className="text-center space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4">
           <span className="bg-indigo-50 text-indigo-600 font-black uppercase tracking-[0.4em] text-[9px] px-6 py-2 rounded-full border border-indigo-100">
             Performance Metrics
           </span>
        </div>
        <h1 className="text-6xl md:text-9xl font-black text-slate-900 italic tracking-tighter uppercase leading-[0.8]">
          Leader<span className="text-indigo-600">board</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-md mx-auto leading-relaxed">
          Celebrating the most influential minds and active contributors within our decision-making ecosystem.
        </p>
      </div>

      {/* Podium for Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 lg:gap-12 items-end px-4 max-w-6xl mx-auto pt-16">
        {sortedUsers.slice(0, 3).map((user, index) => {
          const isFirst = index === 0;
          const isSecond = index === 1;
          const isThird = index === 2;

          const order = isFirst ? 'md:order-2' : isSecond ? 'md:order-1' : 'md:order-3';
          const podiumHeight = isFirst ? 'h-[24rem]' : isSecond ? 'h-[20rem]' : 'h-[18rem]';
          const medalGlow = isFirst ? 'from-amber-200 to-yellow-500' : isSecond ? 'from-slate-200 to-slate-400' : 'from-orange-200 to-orange-400';
          const rankLabel = isFirst ? 'Supreme' : isSecond ? 'Elite' : 'Expert';

          return (
            <div key={user.id} className={`flex flex-col items-center space-y-8 ${order}`}>
              <div className="relative group">
                {/* Halo Glow */}
                <div className={`absolute -inset-10 bg-gradient-to-tr ${medalGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition duration-1000`}></div>
                
                <div className={`relative ${isFirst ? 'w-44 h-44' : 'w-32 h-32'} rounded-[2.5rem] p-1.5 bg-white shadow-2xl ring-4 ring-white transition-all duration-700 group-hover:scale-105 group-hover:-rotate-3`}>
                  <img 
                    src={user.avatarURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`} 
                    alt={user.name} 
                    className="w-full h-full rounded-[2.2rem] object-cover bg-slate-50"
                    onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`)}
                  />
                  <div className={`absolute -bottom-4 -right-4 w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center font-black text-2xl tracking-tighter ${isFirst ? 'text-yellow-500' : 'text-slate-400'}`}>
                    {index + 1}
                  </div>
                </div>
              </div>
              
              <div className={`w-full ${podiumHeight} bg-white rounded-t-[4rem] shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.06)] border-x border-t border-slate-50 p-10 flex flex-col items-center justify-between text-center relative overflow-hidden group`}>
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${medalGlow} scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left`}></div>
                
                <div className="pt-4">
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2 block">{rankLabel}</span>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-2xl leading-tight truncate w-full px-2">{user.name}</h3>
                </div>
                
                <div className="space-y-0">
                  <div className={`font-black text-slate-900 tracking-tighter italic tabular-nums leading-none ${isFirst ? 'text-8xl' : 'text-7xl'}`}>{user.total}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Aggregate Points</div>
                </div>

                <div className="w-full pt-8 border-t border-slate-50 flex justify-around text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <div className="flex flex-col items-center">
                    <span className="text-slate-900 text-lg mb-0.5">{user.answered}</span>
                    <span className="text-[8px] opacity-60">Impact</span>
                  </div>
                  <div className="h-8 w-px bg-slate-100 self-center"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-slate-900 text-lg mb-0.5">{user.created}</span>
                    <span className="text-[8px] opacity-60">Created</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Others List (Rank 4+) */}
      {sortedUsers.length > 3 && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Global Rank</th>
                    <th className="px-12 py-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Professional Profile</th>
                    <th className="px-8 py-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Votes Cast</th>
                    <th className="px-8 py-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Inquiries Created</th>
                    <th className="px-12 py-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Total Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sortedUsers.slice(3).map((user, index) => (
                    <tr key={user.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                      <td className="px-12 py-8">
                        <span className="font-black text-slate-200 group-hover:text-indigo-600 transition-colors text-2xl italic tracking-tighter tabular-nums">
                          #{index + 4}
                        </span>
                      </td>
                      <td className="px-12 py-8">
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <img 
                              src={user.avatarURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`} 
                              className="w-16 h-16 rounded-[1.5rem] object-cover ring-4 ring-white shadow-xl group-hover:rotate-3 transition-transform duration-500" 
                              alt={user.name} 
                              onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`)}
                            />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 uppercase text-sm tracking-tight">{user.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8 text-center font-black text-slate-600 group-hover:text-slate-900 text-lg tabular-nums transition-colors">{user.answered}</td>
                      <td className="px-8 py-8 text-center font-black text-slate-600 group-hover:text-slate-900 text-lg tabular-nums transition-colors">{user.created}</td>
                      <td className="px-12 py-8 text-right">
                        <span className="inline-flex items-center justify-center min-w-[4rem] px-6 py-3 bg-slate-900 text-white rounded-[1.2rem] font-black text-xs tracking-[0.2em] group-hover:bg-indigo-600 group-hover:shadow-[0_15px_30px_rgba(79,70,229,0.3)] transition-all italic tabular-nums">
                          {user.total}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;