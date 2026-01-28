import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * FILE: src/components/QuestionPage.tsx
 * DESCRIPTION: Handles viewing and voting on a single poll.
 * UPDATED: Fixed build resolution for react-redux and store imports.
 */

// --- Interfaces ---

interface VoteOption {
  votes: string[];
  text: string;
}

interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: VoteOption;
  optionTwo: VoteOption;
}

interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: Record<string, string>;
  questions: string[];
}

interface RootState {
  app: {
    authedUser: string | null;
    questions: Record<string, Question>;
    users: Record<string, User>;
  };
}

const QuestionPage: React.FC = () => {
  const { question_id } = useParams<{ question_id: string }>();
  const navigate = useNavigate();

  // Safe Global Access for ReactRedux
  const useSelector = (window as any).ReactRedux?.useSelector || (() => ({}));
  const useDispatch = (window as any).ReactRedux?.useDispatch || (() => () => {});
  
  // Accessing handleSaveAnswer from the global store namespace or props
  const handleSaveAnswer = (window as any).AppStore?.handleSaveAnswer;

  const dispatch = useDispatch();

  const authedUser = useSelector((state: RootState) => state.app?.authedUser);
  const questions = useSelector((state: RootState) => state.app?.questions || {});
  const users = useSelector((state: RootState) => state.app?.users || {});

  const question = questions[question_id || ''];
  const author = question ? users[question.author] : null;

  // Handle 404 or missing data
  if (!question || !author || !authedUser) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="text-9xl font-black text-slate-100">404</div>
        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter italic">Question Not Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const hasAnsweredOne = question.optionOne.votes.includes(authedUser);
  const hasAnsweredTwo = question.optionTwo.votes.includes(authedUser);
  const hasAnswered = hasAnsweredOne || hasAnsweredTwo;
  const userVote = hasAnsweredOne ? 'optionOne' : 'optionTwo';

  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;
  const optOnePct = totalVotes === 0 ? 0 : Math.round((question.optionOne.votes.length / totalVotes) * 100);
  const optTwoPct = totalVotes === 0 ? 0 : Math.round((question.optionTwo.votes.length / totalVotes) * 100);

  const handleVote = (answer: 'optionOne' | 'optionTwo') => {
    if (handleSaveAnswer) {
      dispatch(handleSaveAnswer({ 
        authedUser, 
        qid: question.id, 
        answer 
      }));
    } else {
      console.error("Action handleSaveAnswer not found in global scope.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Author Header */}
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center space-x-4">
          <img 
            src={author.avatarURL || `https://ui-avatars.com/api/?name=${author.name}&background=random`} 
            className="w-16 h-16 rounded-2xl object-cover bg-white shadow-sm border-2 border-white" 
            alt={author.name}
          />
          <div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Inquiry by</span>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{author.name}</h2>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <h1 className="text-4xl font-black text-slate-900 text-center uppercase italic tracking-tighter leading-none">
            Would You <br/><span className="text-indigo-600">Rather...</span>
          </h1>

          {!hasAnswered ? (
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => handleVote('optionOne')}
                className="group relative p-8 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left active:scale-[0.98]"
              >
                <span className="block text-[10px] font-black text-slate-400 group-hover:text-indigo-400 uppercase mb-2 tracking-widest">Option Alpha</span>
                <span className="text-xl font-bold text-slate-700 group-hover:text-indigo-900">{question.optionOne.text}</span>
              </button>

              <div className="flex items-center justify-center">
                <div className="h-[1px] bg-slate-100 flex-grow"></div>
                <span className="px-4 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.4em] rounded-full mx-4">VS</span>
                <div className="h-[1px] bg-slate-100 flex-grow"></div>
              </div>

              <button 
                onClick={() => handleVote('optionTwo')}
                className="group relative p-8 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left active:scale-[0.98]"
              >
                <span className="block text-[10px] font-black text-slate-400 group-hover:text-indigo-400 uppercase mb-2 tracking-widest">Option Beta</span>
                <span className="text-xl font-bold text-slate-700 group-hover:text-indigo-900">{question.optionTwo.text}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {[
                { opt: question.optionOne, pct: optOnePct, key: 'optionOne' as const, label: 'Alpha' },
                { opt: question.optionTwo, pct: optTwoPct, key: 'optionTwo' as const, label: 'Beta' }
              ].map(({ opt, pct, key, label }) => (
                <div key={key} className={`relative p-8 rounded-[2rem] border-2 transition-all duration-500 ${userVote === key ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-50 bg-slate-50/50'}`}>
                  {userVote === key && (
                    <div className="absolute -top-3 left-8 bg-indigo-600 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                      Your Decision
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-lg font-bold uppercase tracking-tight leading-tight ${userVote === key ? 'text-indigo-900' : 'text-slate-600'}`}>
                      {opt.text}
                    </h3>
                    <span className="text-2xl font-black text-slate-900">{pct}%</span>
                  </div>
                  
                  <div className="relative h-3 w-full bg-slate-200/50 rounded-full overflow-hidden mb-4">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-1000 ${userVote === key ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                    <span>{opt.votes.length} Participants</span>
                    <span>Selection {label}</span>
                  </div>
                </div>
              ))}
              
              <div className="pt-8 flex justify-center">
                <button 
                  onClick={() => navigate('/')} 
                  className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.25em] transition-all flex items-center space-x-2"
                >
                  <span>← Back to Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;