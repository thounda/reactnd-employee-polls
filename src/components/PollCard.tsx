import React from 'react';
import { Link } from 'react-router-dom';

/**
 * File: src/components/PollCard.tsx
 * Description: Renders a summary card for a single poll question in the Dashboard list.
 * Design: High-fidelity tile with hover states and integrated Avatar logic.
 */

interface Option {
  text: string;
  votes: string[];
}

interface Question {
  id: string;
  author: string;
  timestamp: number;
  optionOne: Option;
  optionTwo: Option;
}

interface PollCardProps {
  questionId: string;
}

/**
 * Integrated Inline Avatar component to resolve build errors
 */
const InlineAvatar: React.FC<{ url: string; name: string; size: string }> = ({ url, name, size }) => {
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
  
  return (
    <div className={`${size} rounded-[1.5rem] overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex-shrink-0`}>
      <img 
        src={url || fallbackUrl} 
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = fallbackUrl;
        }}
      />
    </div>
  );
};

const PollCard: React.FC<PollCardProps> = ({ questionId }) => {
  // Access Redux hooks from the global window object
  const useSelector = (window as any).ReactRedux?.useSelector || (() => ({}));
  
  const { question, author, isAnswered } = useSelector((state: any) => {
    const q = state.app?.questions?.[questionId] || state.questions?.[questionId];
    const user = q ? (state.app?.users?.[q.author] || state.users?.[q.author]) : undefined;
    const authedUser = state.app?.authedUser || state.authedUser;
    
    const currentUser = authedUser ? (state.app?.users?.[authedUser] || state.users?.[authedUser]) : null;
    const answered = currentUser?.answers?.[questionId] !== undefined;

    return {
      question: q,
      author: user,
      isAnswered: answered
    };
  });

  if (!question || !author) return null;

  const summaryText = question.optionOne.text;
  const pollUrl = `/questions/${question.id}`;
  
  return (
    <Link to={pollUrl} className="block group">
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 p-6 sm:p-8 bg-white border border-slate-100 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 hover:border-indigo-100 hover:-translate-y-1">
        
        {/* Status Badge */}
        <div className={`absolute top-4 right-6 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
          isAnswered ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
        }`}>
          {isAnswered ? 'Completed' : 'Active'}
        </div>

        {/* Avatar Section using integrated component */}
        <div className="relative">
          <InlineAvatar 
            url={author.avatarURL} 
            name={author.name} 
            size="w-20 h-20" 
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className={`w-3 h-3 rounded-full ${isAnswered ? 'bg-emerald-400' : 'bg-indigo-500 animate-pulse'}`}></div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-grow text-center sm:text-left min-w-0 pt-1">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">
            {author.name} <span className="text-slate-200">|</span> {new Date(question.timestamp).toLocaleDateString()}
          </p>
          
          <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
            Would You Rather...
          </h3>
          
          <p className="text-slate-500 text-sm italic font-medium truncate pr-4">
            "{summaryText}..."
          </p>

          <div className="mt-6 flex items-center justify-center sm:justify-start space-x-2">
            <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all duration-500 ${
              isAnswered 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                : 'bg-slate-900 text-white shadow-lg shadow-slate-200 group-hover:bg-indigo-600 group-hover:shadow-indigo-100'
            }`}>
              {isAnswered ? 'Review Results' : 'Cast Vote'}
            </span>
            
            <svg className={`w-4 h-4 transition-all duration-500 transform group-hover:translate-x-1 ${
              isAnswered ? 'text-emerald-500' : 'text-slate-400 group-hover:text-indigo-600'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PollCard;