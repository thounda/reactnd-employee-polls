import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface DashboardProps {
  onNavigate?: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'unanswered' | 'answered'>('unanswered');
  const navigate = useNavigate();

  // State extraction
  const { questions, users, authedUser } = useAppSelector((state: any) => {
    // This logic handles various store shapes; 
    // You can simplify this to state.questions, etc., if your store is flat.
    const root = state.app || state;
    return {
      questions: root.questions || {},
      users: root.users || {},
      authedUser: typeof root.authedUser === 'object' ? root.authedUser?.id : root.authedUser
    };
  });

  const handleCardClick = (id: string) => {
    const target = `/questions/${id}`;
    if (onNavigate) {
      onNavigate(`questions/${id}`);
    } else {
      navigate(target);
    }
  };

  const questionIds = Object.keys(questions).sort(
    (a, b) => (questions[b].timestamp || 0) - (questions[a].timestamp || 0)
  );

  const answeredIds = questionIds.filter((id) => {
    if (!authedUser) return false;
    const q = questions[id];
    return (
      (q.optionOne?.votes || []).includes(authedUser) ||
      (q.optionTwo?.votes || []).includes(authedUser)
    );
  });

  const unansweredIds = questionIds.filter((id) => !answeredIds.includes(id));
  const displayList = filter === 'unanswered' ? unansweredIds : answeredIds;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
            <span className="text-indigo-600 font-black uppercase tracking-[0.4em] text-[9px]">Live Ecosystem</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            Feed
          </h1>
        </div>

        <div className="relative flex bg-slate-100/80 backdrop-blur-md p-1.5 rounded-[2rem] w-full md:w-auto border border-slate-200/50">
          <button
            onClick={() => setFilter('unanswered')}
            className={`relative z-10 px-10 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
              filter === 'unanswered' ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            Unanswered
          </button>
          <button
            onClick={() => setFilter('answered')}
            className={`relative z-10 px-10 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${
              filter === 'answered' ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            Answered
          </button>
          <div 
            className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-[1.5rem] shadow-xl transition-transform duration-500 ${
              filter === 'answered' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
        </div>
      </div>

      {displayList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayList.map((id) => {
            const question = questions[id];
            const author = users[question.author];
            return (
              <div
                key={id}
                onClick={() => handleCardClick(id)}
                className="group cursor-pointer bg-white rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
              >
                <div className="p-10 flex-1">
                  <div className="flex items-center space-x-4 mb-8">
                    <img
                      src={author?.avatarURL || ''}
                      alt={author?.name}
                      className="w-12 h-12 rounded-xl bg-slate-100 object-cover"
                      onError={(e) => {(e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${author?.name}&background=random`;}}
                    />
                    <div>
                      <h3 className="font-black text-slate-900 text-sm uppercase">{author?.name}</h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(question.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 italic tracking-tighter mb-6">Would You Rather...</h4>
                  <p className="text-slate-600 font-medium text-sm border-l-2 border-indigo-500 pl-4 py-1 italic">
                    {question.optionOne.text} or...
                  </p>
                </div>
                <div className="px-10 py-6 bg-slate-900 group-hover:bg-indigo-600 transition-colors flex justify-between items-center">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">View Details</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-32 border-2 border-dashed border-slate-100 rounded-[4rem]">
          <h2 className="text-2xl font-black text-slate-900 uppercase italic">All Caught Up</h2>
          <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">No polls available in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;