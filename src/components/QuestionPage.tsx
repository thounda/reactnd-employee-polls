
/**
 * FILE: src/components/QuestionPage.tsx
 * DESCRIPTION: 
 * Enhanced Poll Detail view. Manages the transition between voting and 
 * results with a premium, high-contrast UI.
*/

import React, { useState } from 'react';

// Note: Imports are kept for the production build but mocked for the preview below.
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { handleAddAnswer } from '../slices/questionsSlice';
import { RootState } from '../slices/types';

const Avatar: React.FC<{ url?: string; name: string }> = ({ url, name }) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`;
  return (
    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-slate-100 ring-1 ring-slate-100">
      <img 
        src={url || fallback} 
        alt={name} 
        className="w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
      />
    </div>
  );
};

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authedUser = useSelector((state: RootState) => state.authedUser.value);
  const users = useSelector((state: RootState) => state.users);
  const questions = useSelector((state: RootState) => state.questions);

  const question = id ? questions[id] : null;
  const author = question ? users[question.author] : null;

  if (!question || !author) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <h1 className="text-[12rem] font-black text-slate-50 leading-none">404</h1>
        <p className="text-slate-900 font-black uppercase tracking-[0.3em] text-xl -mt-8 bg-white px-4">Poll Missing</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-12 px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-indigo-600 transition-all duration-500"
        >
          Return Home
        </button>
      </div>
    );
  }

  const hasVoted = authedUser ? !!users[authedUser].answers[question.id] : false;
  const myAnswer = authedUser ? users[authedUser].answers[question.id] : null;

  const votesOne = question.optionOne.votes.length;
  const votesTwo = question.optionTwo.votes.length;
  const totalVotes = votesOne + votesTwo;
  const percentOne = totalVotes > 0 ? Math.round((votesOne / totalVotes) * 100) : 0;
  const percentTwo = totalVotes > 0 ? Math.round((votesTwo / totalVotes) * 100) : 0;

  const handleVote = (answer: 'optionOne' | 'optionTwo') => {
    if (authedUser && id) {
      dispatch(handleAddAnswer({ authedUser, qid: id, answer }) as any);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="relative mb-8">
          <Avatar url={author.avatarURL} name={author.name} />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
            Curated By
          </div>
        </div>
        <h2 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-2">{author.name}</h2>
        <h1 className="text-5xl sm:text-7xl font-black text-slate-900 italic uppercase tracking-tighter leading-[0.85]">
          Would You <span className="text-indigo-600">Rather?</span>
        </h1>
      </div>

      {!hasVoted ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['optionOne', 'optionTwo'] as const).map((key) => (
            <button
              key={key}
              onClick={() => handleVote(key)}
              className="group relative p-12 bg-white border-2 border-slate-100 rounded-[3rem] text-left transition-all duration-500 hover:border-indigo-500 hover:shadow-[0_30px_60px_rgba(79,70,229,0.1)] hover:-translate-y-1"
            >
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4 block">Selection {key === 'optionOne' ? 'A' : 'B'}</span>
              <p className="text-2xl font-black text-slate-800 uppercase leading-tight group-hover:text-indigo-600 transition-colors">
                {question[key].text}
              </p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                Commit Decision <span className="text-lg">→</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {(['optionOne', 'optionTwo'] as const).map((key) => {
            const isSelected = myAnswer === key;
            const percent = key === 'optionOne' ? percentOne : percentTwo;
            const votes = key === 'optionOne' ? votesOne : votesTwo;
            
            return (
              <div key={key} className={`relative p-10 rounded-[3rem] border-2 transition-all duration-700 ${isSelected ? 'border-indigo-500 bg-white shadow-xl' : 'border-slate-100 bg-slate-50/50'}`}>
                {isSelected && (
                  <div className="absolute -top-3 right-12 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    Your Path
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <p className={`text-2xl font-black uppercase leading-tight max-w-lg ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                    {question[key].text}
                  </p>
                  <div className="text-right">
                    <span className={`text-5xl font-black tracking-tighter ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>{percent}%</span>
                  </div>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-4 shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${isSelected ? 'bg-indigo-500' : 'bg-slate-300'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Option {key === 'optionOne' ? 'A' : 'B'}</span>
                  <span>{votes} out of {totalVotes} peers</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestionPage;

