import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

/**
 * FILE: src/components/PollCard.tsx
 * DESCRIPTION: 
 * A high-fidelity, reusable card component for individual polls. 
 * Features distinct styling for 'Answered' vs 'Unanswered' states
 * and premium hover interactions.
 */

interface PollCardProps {
  id: string;
  onNavigate?: (path: string) => void;
}

const PollCard: React.FC<PollCardProps> = ({ id, onNavigate }) => {
  const navigate = useNavigate();

  const { question, author, authedUser } = useAppSelector((state: any) => {
    const root = state.app || state;
    const q = root.questions?.[id];
    return {
      question: q,
      author: root.users?.[q?.author],
      authedUser: typeof root.authedUser === 'object' ? root.authedUser?.id : root.authedUser
    };
  });

  if (!question || !author) return null;

  const isAnswered = 
    question.optionOne.votes.includes(authedUser) || 
    question.optionTwo.votes.includes(authedUser);

  const handleAction = () => {
    if (onNavigate) {
      onNavigate(`questions/${id}`);
    } else {
      navigate(`/questions/${id}`);
    }
  };

  return (
    <div 
      onClick={handleAction}
      className="group relative cursor-pointer bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
    >
      {/* Status Badge */}
      <div className="absolute top-6 right-6 z-20">
        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-sm ${
          isAnswered 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
            : 'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>
          {isAnswered ? 'Completed' : 'Pending'}
        </span>
      </div>

      <div className="p-8 flex-1">
        {/* Author Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <img
              src={author.avatarURL}
              alt={author.name}
              className="w-12 h-12 rounded-2xl bg-slate-100 object-cover ring-4 ring-slate-50 group-hover:rotate-3 transition-transform"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=6366f1&color=fff`; }}
            />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-tight truncate">
              {author.name}
            </h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {new Date(question.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        <h4 className="text-xl font-black text-slate-900 italic tracking-tighter leading-tight mb-6">
          Would You <br/>Rather...
        </h4>

        {/* Options Preview */}
        <div className="space-y-3">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
            <p className="text-slate-600 font-bold text-xs italic line-clamp-1">
              "{question.optionOne.text}"
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <span className="text-[8px] font-black text-slate-300 italic tracking-[0.3em]">OR</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
            <p className="text-slate-600 font-bold text-xs italic line-clamp-1">
              "{question.optionTwo.text}"
            </p>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className={`px-8 py-5 flex items-center justify-between transition-colors duration-500 ${
        isAnswered ? 'bg-slate-900 group-hover:bg-emerald-600' : 'bg-slate-900 group-hover:bg-indigo-600'
      }`}>
        <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">
          {isAnswered ? 'View Results' : 'Cast Your Vote'}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>
    </div>
  );
};

export default PollCard;