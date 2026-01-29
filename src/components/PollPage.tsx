import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";

/**
 * FILE: src/components/PollPage.tsx
 * DESCRIPTION: 
 * Manages the display logic for a single poll. 
 * Shows results if already answered, otherwise shows the high-fidelity voting form.
 * FIX: Integrated UnansweredPoll logic directly to avoid resolution errors.
 */

// --- Types & Interfaces ---

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
  avatarURL: string;
  answers: { [key: string]: string };
}

// --- Internal Helper Components ---

const AvatarFallback = ({ url, name, size }: { url: string; name: string; size: 'sm' | 'lg' }) => (
  <div className={`rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 ${size === 'lg' ? 'w-24 h-24' : 'w-10 h-10'}`}>
    <img 
      src={url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`} 
      alt={name} 
      className="w-full h-full object-cover"
    />
  </div>
);

const NotFoundFallback = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="relative">
       <h1 className="text-[12rem] font-black text-slate-100 leading-none select-none">404</h1>
       <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-slate-900 font-black uppercase tracking-[0.3em] text-xl mt-12">Lost in Space</p>
       </div>
    </div>
    <p className="text-slate-400 font-bold uppercase tracking-widest mt-4 text-[10px]">The poll you are looking for does not exist.</p>
    <button 
      onClick={() => window.location.href = '/'}
      className="mt-8 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-indigo-600 transition-all"
    >
      Return Home
    </button>
  </div>
);

// --- Sub-Components ---

const UnansweredPoll: React.FC<{ question: Question; author: User; onVote: (option: string) => void }> = ({ question, author, onVote }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex flex-col items-center">
          <AvatarFallback url={author.avatarURL} name={author.name} size="lg" />
          <h2 className="mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">
            Question by {author.name}
          </h2>
        </div>
        <h1 className="text-5xl font-black text-slate-900 mt-6 tracking-tighter italic uppercase leading-tight">
          Would You <br/> Rather...
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['optionOne', 'optionTwo'] as const).map((optionKey) => (
          <button
            key={optionKey}
            onClick={() => setSelected(optionKey)}
            className={`relative p-10 rounded-[2.5rem] border-4 transition-all duration-500 text-left group ${
              selected === optionKey 
                ? 'border-indigo-600 bg-indigo-50/50 shadow-2xl shadow-indigo-100' 
                : 'border-white bg-white hover:border-slate-100 hover:shadow-xl'
            }`}
          >
            <div className={`w-10 h-10 rounded-full border-2 mb-6 flex items-center justify-center transition-all ${
              selected === optionKey ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'
            }`}>
              {selected === optionKey && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
            <p className={`text-2xl font-black leading-tight uppercase tracking-tight ${
              selected === optionKey ? 'text-indigo-900' : 'text-slate-700'
            }`}>
              {question[optionKey].text}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button
          disabled={!selected}
          onClick={() => selected && onVote(selected)}
          className={`px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-xl ${
            selected 
              ? 'bg-slate-900 text-white hover:bg-indigo-600 hover:-translate-y-1 shadow-indigo-200' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Confirm My Choice
        </button>
      </div>
    </div>
  );
};

const AnsweredPollResults: React.FC<{ question: Question; author: User; authedUserAnswer: string }> = ({ question, author, authedUserAnswer }) => {
  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;
  const calculatePercent = (votes: number) => totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden max-w-2xl mx-auto border border-slate-100">
      <div className="bg-slate-50/50 p-8 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <AvatarFallback url={author.avatarURL} name={author.name} size="sm" />
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Results Analyzed by <span className="text-slate-900">{author.name}</span>
          </h2>
        </div>
        <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
          Poll Completed
        </span>
      </div>

      <div className="p-12">
        <h1 className="text-4xl font-black text-slate-900 mb-12 italic tracking-tighter uppercase leading-none text-center">
          The Collective <br/> Vote
        </h1>

        <div className="space-y-8">
          {(['optionOne', 'optionTwo'] as const).map((optionKey) => {
            const option = question[optionKey];
            const isSelected = authedUserAnswer === optionKey;
            const votes = option.votes.length;
            const percent = calculatePercent(votes);

            return (
              <div 
                key={optionKey} 
                className={`relative p-8 rounded-[2rem] border-2 transition-all duration-700 ${
                  isSelected ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-50 bg-slate-50/40'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 left-8 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-indigo-100">
                    Your Selection
                  </div>
                )}
                <div className="flex justify-between items-end mb-5">
                  <p className={`text-xl font-black uppercase tracking-tight max-w-[70%] ${isSelected ? 'text-indigo-900' : 'text-slate-600'}`}>{option.text}</p>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">{percent}%</span>
                </div>
                <div className="w-full bg-slate-200/50 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${isSelected ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-400'}`} 
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>{votes} {votes === 1 ? 'Vote' : 'Votes'}</span>
                  <span>{totalVotes} Total</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Main PollPage Component ---

const PollPage: React.FC = () => {
  const { question_id } = useParams<{ question_id: string }>();
  
  // Redux Hook extraction
  const useSelector = (window as any).ReactRedux?.useSelector || (() => ({}));
  const useDispatch = (window as any).ReactRedux?.useDispatch || (() => () => {});
  const dispatch = useDispatch();

  const authedUser = useSelector((state: any) => state.app?.authedUser || state.authedUser);
  const questions = useSelector((state: any) => state.app?.questions || state.questions || {});
  const users = useSelector((state: any) => state.app?.users || state.users || {});

  const question = question_id ? questions[question_id] : null;

  if (!question) {
    return <NotFoundFallback />;
  }

  const author = users[question.author];
  const authedUserAnswer = question.optionOne.votes.includes(authedUser) 
    ? 'optionOne' 
    : question.optionTwo.votes.includes(authedUser) 
      ? 'optionTwo' 
      : null;

  const handleVote = (answer: string) => {
    // Attempting to use the handleAnswerQuestion action from window.actions or typical Redux structure
    const handleAnswerQuestion = (window as any).handleAnswerQuestion;
    if (handleAnswerQuestion) {
      dispatch(handleAnswerQuestion({
        authedUser,
        qid: question.id,
        answer
      }));
    } else {
      console.warn("handleAnswerQuestion action not found in global scope.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 px-6 py-16">
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
  );
};

export default PollPage;