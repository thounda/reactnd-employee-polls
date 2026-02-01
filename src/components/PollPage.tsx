import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../store/hooks'; 
import { handleAddAnswer } from '../slices/questionsSlice'; 

/**
 * FILE: src/components/PollPage.tsx
 * DESCRIPTION: 
 * Premium display logic for a single poll. 
 * Updated with internal environment handling to resolve preview compilation errors.
 */

// --- Types ---
interface PollOption {
  text: string;
  votes: string[];
}

interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: PollOption;
  optionTwo: PollOption;
}

interface User {
  id: string;
  name: string;
  avatarURL?: string;
  answers: { [key: string]: string };
}

// --- Internal Helper Components ---

const AvatarContainer: React.FC<{ url?: string; name: string; size: 'sm' | 'lg' }> = ({ url, name, size }) => {
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`;
  const dimensions = size === 'lg' ? 'w-28 h-28' : 'w-12 h-12';
  
  return (
    <div className={`${dimensions} rounded-[2rem] overflow-hidden border-4 border-white shadow-xl flex-shrink-0 bg-slate-100`}>
      <img 
        src={url || fallbackUrl} 
        alt={name} 
        className="w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = fallbackUrl; }}
      />
    </div>
  );
};

const NotFoundFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
    <div className="relative group">
       <h1 className="text-[10rem] sm:text-[15rem] font-black text-slate-100 leading-none select-none transition-transform duration-700 group-hover:scale-110">404</h1>
       <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-900 font-black uppercase tracking-[0.4em] text-xl sm:text-2xl mt-12 bg-white/80 backdrop-blur-sm px-4">Void</p>
       </div>
    </div>
    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] mt-8 text-xs max-w-xs">
      The decision matrix you seek does not exist or has been redacted.
    </p>
    <button 
      onClick={() => window.location.href = '/'}
      className="mt-12 px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-indigo-600 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all duration-500"
    >
      Return to Dashboard
    </button>
  </div>
);

const UnansweredPoll: React.FC<{ question: Question; author: User; onVote: (option: 'optionOne' | 'optionTwo') => void }> = ({ question, author, onVote }) => {
  const [selected, setSelected] = useState<'optionOne' | 'optionTwo' | null>(null);

  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="text-center mb-16 space-y-6">
        <div className="inline-flex flex-col items-center relative">
          <AvatarContainer url={author.avatarURL} name={author.name} size="lg" />
          <div className="absolute -bottom-3 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
            Author
          </div>
        </div>
        <div className="pt-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">
            Inquiry initiated by {author.name}
          </h2>
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.9]">
            Would You <br/> <span className="text-indigo-600">Rather...</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {(['optionOne', 'optionTwo'] as const).map((optionKey) => (
          <button
            key={optionKey}
            onClick={() => setSelected(optionKey)}
            className={`relative p-12 rounded-[3.5rem] border-4 transition-all duration-700 text-left overflow-hidden group ${
              selected === optionKey 
                ? 'border-indigo-600 bg-white shadow-[0_40px_80px_rgba(79,70,229,0.15)] -translate-y-2' 
                : 'border-transparent bg-white shadow-sm hover:shadow-xl hover:border-slate-100'
            }`}
          >
            <div className={`absolute top-8 right-8 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              selected === optionKey ? 'border-indigo-600 bg-indigo-600 scale-110' : 'border-slate-200 group-hover:border-indigo-300'
            }`}>
              {selected === optionKey && (
                 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                 </svg>
              )}
            </div>

            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 block">
              {optionKey === 'optionOne' ? 'Alpha Path' : 'Beta Path'}
            </span>
            <p className={`text-3xl font-black leading-tight uppercase tracking-tight break-words ${
              selected === optionKey ? 'text-slate-900' : 'text-slate-500 transition-colors group-hover:text-slate-700'
            }`}>
              {question[optionKey].text}
            </p>
            <div className={`absolute bottom-0 left-0 h-2 bg-indigo-600 transition-all duration-700 ${selected === optionKey ? 'w-full' : 'w-0'}`} />
          </button>
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <button
          disabled={!selected}
          onClick={() => selected && onVote(selected)}
          className={`group flex items-center gap-4 px-16 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl ${
            selected 
              ? 'bg-slate-900 text-white hover:bg-indigo-600 hover:-translate-y-1 hover:shadow-indigo-300' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Submit Decision
          <svg className={`w-5 h-5 transition-transform duration-500 ${selected ? 'group-hover:translate-x-2' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const AnsweredPollResults: React.FC<{ question: Question; author: User; authedUserAnswer: string }> = ({ question, author, authedUserAnswer }) => {
  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;
  const calculatePercent = (votes: number) => totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-50">
        <div className="bg-slate-50/80 backdrop-blur-md p-10 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <AvatarContainer url={author.avatarURL} name={author.name} size="sm" />
            <div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Analyzed by
              </h2>
              <p className="text-sm font-black text-slate-900 uppercase">{author.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Consensus</span>
          </div>
        </div>

        <div className="p-10 sm:p-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
              The <span className="text-indigo-600">Consensus</span>
            </h1>
          </div>

          <div className="space-y-10">
            {(['optionOne', 'optionTwo'] as const).map((optionKey) => {
              const option = question[optionKey];
              const isSelected = authedUserAnswer === optionKey;
              const votes = option.votes.length;
              const percent = calculatePercent(votes);

              return (
                <div 
                  key={optionKey} 
                  className={`relative p-10 rounded-[3rem] border-2 transition-all duration-1000 ${
                    isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-50 bg-white shadow-sm'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-3 right-10 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full shadow-xl">
                      Your Choice
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                    <div className="max-w-[80%]">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Option {optionKey === 'optionOne' ? 'A' : 'B'}</span>
                      <p className={`text-2xl font-black uppercase tracking-tight leading-tight ${isSelected ? 'text-indigo-950' : 'text-slate-600'}`}>{option.text}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{percent}%</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Consistency</span>
                    </div>
                  </div>

                  <div className="relative w-full bg-slate-100 rounded-full h-5 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-[1.5s] ${
                        isSelected 
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)]' 
                          : 'bg-slate-300'
                      }`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="mt-5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="text-slate-900">{votes}</span>
                      <span>Individual {votes === 1 ? 'Vote' : 'Votes'}</span>
                    </div>
                    <div className="text-slate-400">
                      Total: {totalVotes}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main PollPage Component ---

const PollPage: React.FC = () => {
  const { question_id } = useParams<{ question_id: string }>();

  const dispatch = useAppDispatch();

  // RTK Selectors
  const authedUser = useAppSelector((state: any) => state.authedUser);
  const questions = useAppSelector((state: any) => state.questions);
  const users = useAppSelector((state: any) => state.users);

  const question = question_id ? questions[question_id] : null;

  if (!question) {
    return <NotFoundFallback />;
  }

  const author = users[question.author];
  const currentUserId = typeof authedUser === 'string' ? authedUser : authedUser?.id;

  const authedUserAnswer = question.optionOne.votes.includes(currentUserId) 
    ? 'optionOne' 
    : question.optionTwo.votes.includes(currentUserId) 
      ? 'optionTwo' 
      : null;

  const handleVote = (answer: 'optionOne' | 'optionTwo') => {
    dispatch(handleAddAnswer({
      authedUser: currentUserId,
      qid: question.id,
      answer
    }));
  };

  return (
    <div className="min-h-screen bg-[#fafbff]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {authedUserAnswer ? (
          <AnsweredPollResults 
            question={question} 
            author={author} 
            authedUserAnswer={authedUserAnswer} 
          />
        ) : (
          <UnansweredPoll 
            question={question} 
            author={author} 
            onVote={handleVote} 
          />
        )}
      </div>
    </div>
  );
};

export default PollPage;