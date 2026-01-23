import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { handleSaveAnswer } from '../store/store';

/**
 * FILE: src/components/QuestionPage.tsx
 * DESCRIPTION: Handles viewing and voting on a single poll.
 * Fully typed with TypeScript interfaces for state and props.
 */

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
  const dispatch = useDispatch<any>();

  const authedUser = useSelector((state: RootState) => state.app.authedUser);
  const questions = useSelector((state: RootState) => state.app.questions);
  const users = useSelector((state: RootState) => state.app.users);

  const question = questions[question_id || ''];
  const author = question ? users[question.author] : null;

  // Handle 404 or missing data
  if (!question || !author || !authedUser) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="text-9xl font-black text-slate-100">404</div>
        <h2 className="text-2xl font-bold text-slate-900">Question Not Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          Return Home
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
    dispatch(handleSaveAnswer({ 
      authedUser, 
      qid: question.id, 
      answer 
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        {/* Author Header */}
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center space-x-4">
          <img 
            src={author.avatarURL} 
            className="w-16 h-16 rounded-2xl object-cover bg-white shadow-sm border-2 border-white" 
            alt={author.name}
          />
          <div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Question by</span>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{author.name}</h2>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <h1 className="text-3xl font-black text-slate-900 text-center uppercase italic tracking-tighter">
            Would You Rather...
          </h1>

          {!hasAnswered ? (
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => handleVote('optionOne')}
                className="group relative p-8 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left active:scale-[0.98]"
              >
                <span className="block text-xs font-black text-slate-400 group-hover:text-indigo-400 uppercase mb-2">Option A</span>
                <span className="text-xl font-bold text-slate-700 group-hover:text-indigo-900">{question.optionOne.text}</span>
              </button>

              <div className="flex items-center justify-center">
                <span className="px-4 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full">OR</span>
              </div>

              <button 
                onClick={() => handleVote('optionTwo')}
                className="group relative p-8 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left active:scale-[0.98]"
              >
                <span className="block text-xs font-black text-slate-400 group-hover:text-indigo-400 uppercase mb-2">Option B</span>
                <span className="text-xl font-bold text-slate-700 group-hover:text-indigo-900">{question.optionTwo.text}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {[
                { opt: question.optionOne, pct: optOnePct, key: 'optionOne' },
                { opt: question.optionTwo, pct: optTwoPct, key: 'optionTwo' }
              ].map(({ opt, pct, key }) => (
                <div key={key} className={`relative p-8 rounded-[2rem] border-2 transition-all ${userVote === key ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100'}`}>
                  {userVote === key && (
                    <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      Your Vote
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{opt.text}</h3>
                  <div className="relative h-6 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div className="absolute top-0 left-0 h-full bg-indigo-600" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span>{opt.votes.length} Votes</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              ))}
              <div className="pt-6 border-t border-slate-100 flex justify-center">
                <button 
                  onClick={() => navigate('/')} 
                  className="text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors"
                >
                  ← Back to Home
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