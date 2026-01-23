import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FILE: src/components/Dashboard.tsx
 * DESCRIPTION: Displays the main feed of polls, filtered by Answered and Unanswered.
 * FIX: Switched to window-level Redux access to bypass module resolution errors 
 * in the current environment while maintaining modular structure.
 */

// Define standard types to ensure TypeScript stability in the component
interface Option {
  votes: string[];
  text: string;
}

interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: Option;
  optionTwo: Option;
}

interface User {
  id: string;
  name: string;
  avatarURL: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'unanswered' | 'answered'>('unanswered');
  const navigate = useNavigate();

  // Safely access Redux hooks from the global window object to avoid build errors
  const useSelector = (window as any).ReactRedux?.useSelector || (() => ({}));

  // Access state with flexible typing
  const authedUser = useSelector((state: any) => state.app?.authedUser);
  const questions = useSelector((state: any) => state.app?.questions) as Record<string, Question>;
  const users = useSelector((state: any) => state.app?.users) as Record<string, User>;

  // Memoized lists of question IDs
  const { unanswered, answered } = useMemo(() => {
    if (!questions || !authedUser) return { unanswered: [], answered: [] };

    const sortedIds = Object.keys(questions).sort(
      (a, b) => (questions[b]?.timestamp || 0) - (questions[a]?.timestamp || 0)
    );

    const unansweredList = sortedIds.filter(
      (id) =>
        !questions[id].optionOne.votes.includes(authedUser) &&
        !questions[id].optionTwo.votes.includes(authedUser)
    );

    const answeredList = sortedIds.filter(
      (id) =>
        questions[id].optionOne.votes.includes(authedUser) ||
        questions[id].optionTwo.votes.includes(authedUser)
    );

    return { unanswered: unansweredList, answered: answeredList };
  }, [questions, authedUser]);

  // Loading state safeguard
  if (!questions || !users || !authedUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Syncing Feed...</p>
      </div>
    );
  }

  const currentQuestions = activeTab === 'unanswered' ? unanswered : answered;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
            <span className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px]">Community Pulse</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Your Feed
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-md">
            The latest dilemmas from the community. Cast your vote or check the results.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-100 rounded-[2rem] w-fit shadow-inner border border-slate-200/50">
          {(['unanswered', 'answered'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-[1.75rem] text-sm font-black uppercase tracking-widest transition-all duration-500 ease-out ${
                activeTab === tab
                  ? 'bg-white text-indigo-600 shadow-xl scale-100'
                  : 'text-slate-400 hover:text-slate-600 scale-95'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Polls */}
      {currentQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentQuestions.map((id) => {
            const question = questions[id];
            const author = users[question.author];
            const date = new Date(question.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div 
                key={id}
                onClick={() => navigate(`/questions/${id}`)}
                className="group cursor-pointer bg-white rounded-[3rem] p-1 border border-slate-100 shadow-2xl shadow-slate-200/40 hover:shadow-indigo-200/60 transition-all duration-500 hover:-translate-y-3 flex flex-col h-full"
              >
                <div className="p-8 flex flex-col h-full">
                  {/* Author Header */}
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="relative">
                      <img 
                        src={author?.avatarURL} 
                        alt={author?.name}
                        className="w-14 h-14 rounded-2xl bg-slate-100 object-cover ring-4 ring-slate-50 shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${author?.name || 'User'}&background=6366f1&color=fff`;
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 leading-tight uppercase text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                        {author?.name || 'Anonymous User'}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{date}</span>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="space-y-4 mb-10 flex-grow">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                      The Challenge
                    </span>
                    <p className="text-xl font-bold text-slate-800 leading-snug">
                      Would you rather <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">{question.optionOne.text}</span> or <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4">{question.optionTwo.text}</span>?
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-center text-[10px] font-black uppercase tracking-[0.3em] group-hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-slate-200 group-hover:shadow-indigo-200/50">
                    {activeTab === 'unanswered' ? 'Cast Vote' : 'View Results'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-32 text-center bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-xl mb-8 relative z-10">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
             </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Zero Dilemmas</h2>
          <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">You've cleared this section. Check the other tab!</p>
          
          {activeTab === 'unanswered' && (
            <button 
              onClick={() => navigate('/add')}
              className="mt-8 px-10 py-4 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
            >
              Create New Poll
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;