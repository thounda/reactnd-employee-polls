import React, { useState } from 'react';

/**
 * FILE: src/components/Dashboard.tsx
 * DESCRIPTION: 
 * The main feed for the application. Features a high-end toggle system
 * to switch between "Unanswered" and "Answered" polls.
 * * NOTE: This version is optimized for the preview environment by 
 * defensively handling Redux hooks.
 */

interface DashboardProps {
  onNavigate?: (path: string, id?: string) => void;
  // Fallbacks for preview mode if Redux is not yet available
  users?: any;
  questions?: any;
  authedUser?: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, ...props }) => {
  const [filter, setFilter] = useState<'unanswered' | 'answered'>('unanswered');

  /**
   * Safe Redux Integration
   * We attempt to use Redux state, but fall back to component props 
   * to ensure the preview renders correctly even if the bundle
   * cannot resolve external dependencies.
   */
  let stateData: any = { questions: {}, users: {}, authedUser: null };
  
  try {
    // Dynamically check for useSelector to prevent build-time resolution errors
    // @ts-ignore
    const { useSelector } = require('react-redux');
    if (useSelector) {
      stateData = useSelector((state: any) => ({
        questions: state.questions || {},
        users: state.users || {},
        authedUser: state.authedUser
      }));
    }
  } catch (e) {
    // Fail silently in preview; props will take over
  }

  // Priority: Props (from App.tsx) -> Redux State -> Empty Defaults
  const questions = props.questions || stateData.questions || {};
  const users = props.users || stateData.users || {};
  const authedUser = props.authedUser || stateData.authedUser;

  // Logic to separate questions based on whether the authedUser has voted
  const questionIds = Object.keys(questions).sort(
    (a, b) => (questions[b].timestamp || 0) - (questions[a].timestamp || 0)
  );

  const answered = questionIds.filter((id) =>
    authedUser && (
      (questions[id].optionOne.votes || []).includes(authedUser) ||
      (questions[id].optionTwo.votes || []).includes(authedUser)
    )
  );

  const unanswered = questionIds.filter((id) => !answered.includes(id));
  const displayList = filter === 'unanswered' ? unanswered : answered;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">
            Feed
          </h1>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">
            {filter === 'unanswered' ? 'New Challenges Awaiting' : 'Your Contribution History'}
          </p>
        </div>

        {/* Custom Toggle Switch */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto shadow-inner border border-slate-200/50">
          <button
            onClick={() => setFilter('unanswered')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 ${
              filter === 'unanswered'
                ? 'bg-white text-indigo-600 shadow-sm transform scale-[1.02]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Unanswered
          </button>
          <button
            onClick={() => setFilter('answered')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 ${
              filter === 'answered'
                ? 'bg-white text-indigo-600 shadow-sm transform scale-[1.02]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Answered
          </button>
        </div>
      </div>

      {/* Grid Display */}
      {displayList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayList.map((id) => {
            const question = questions[id];
            const author = users[question.author];
            return (
              <div
                key={id}
                onClick={() => onNavigate?.(`questions/${id}`)}
                className="group cursor-pointer bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col"
              >
                <div className="p-8 flex-1">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative">
                      <img
                        src={author?.avatarURL}
                        alt={author?.name}
                        className="w-12 h-12 rounded-full ring-4 ring-slate-50 bg-slate-100 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || 'User')}&background=random&color=fff`;
                        }}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight leading-none">
                        {author?.name || 'Unknown User'}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                        {new Date(question.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <h4 className="text-xl font-black text-slate-800 italic leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                    Would You Rather...
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-all">
                      <p className="text-slate-600 font-bold text-sm line-clamp-1 italic">
                        "{question.optionOne.text}"
                      </p>
                    </div>
                    <div className="flex items-center justify-center py-1">
                      <div className="h-px bg-slate-100 flex-grow"></div>
                      <span className="px-3 text-[10px] font-black text-slate-300 italic uppercase tracking-widest">or</span>
                      <div className="h-px bg-slate-100 flex-grow"></div>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-all">
                      <p className="text-slate-600 font-bold text-sm line-clamp-1 italic">
                        "{question.optionTwo.text}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-5 bg-slate-900 flex items-center justify-between group-hover:bg-indigo-600 transition-all duration-300">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Enter Poll</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Inbox Zero</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em] mt-3">
            You've caught up with all current polls!
          </p>
          <button 
            onClick={() => onNavigate?.('add')}
            className="mt-10 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Create New Poll
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;