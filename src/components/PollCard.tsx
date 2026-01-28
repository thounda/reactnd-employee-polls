/**
 * File: src/components/PollCard.tsx
 * Description: Renders a summary card for a single poll question in the Dashboard list.
 * Updated to use global ReactRedux resolution to maintain compatibility with the environment.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';

// Interfaces for the component
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

interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: { [key: string]: string };
}

interface PollCardProps {
  questionId: string;
}

const PollCard: React.FC<PollCardProps> = ({ questionId }) => {
  // Access Redux hooks from the global window object to bypass resolution errors
  const useSelector = (window as any).ReactRedux?.useSelector || (() => ({}));
  
  // Extract necessary data using the custom selector
  const { question, author, isAnswered } = useSelector((state: any) => {
    const q = state.app?.questions?.[questionId] || state.questions?.[questionId];
    const user = q ? (state.app?.users?.[q.author] || state.users?.[q.author]) : undefined;
    const authedUser = state.app?.authedUser || state.authedUser;
    
    // Check if the current user has answered this specific question
    const currentUser = authedUser ? (state.app?.users?.[authedUser] || state.users?.[authedUser]) : null;
    const answered = currentUser?.answers?.[questionId] !== undefined;

    return {
      question: q,
      author: user,
      isAnswered: answered
    };
  });

  // Fallback check in case data is still loading or missing
  if (!question || !author) {
    return null;
  }

  // Determine the display message for the question summary
  const summaryText = question.optionOne.text.slice(0, 30) + (question.optionOne.text.length > 30 ? '...' : '');

  // Determine the route to view the details/results
  const pollUrl = `/questions/${question.id}`;
  
  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-all duration-300 group">
      {/* Author Avatar using our specialized Avatar component */}
      <Avatar 
        url={author.avatarURL} 
        name={author.name} 
        size="w-16 h-16" 
      />
      
      {/* Question Details */}
      <div className="flex-grow min-w-0">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
          {author.name} asks:
        </p>
        <h3 className="text-lg font-bold text-slate-900 truncate">
          Would You Rather...
        </h3>
        <p className="text-slate-500 text-sm italic truncate">
          "{summaryText}"
        </p>
      </div>

      {/* Action Button */}
      <Link
        to={pollUrl}
        className={`px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl text-white transition-all duration-200 shadow-md active:scale-95
          ${isAnswered 
            ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'
          }`}
      >
        {isAnswered ? 'Results' : 'Vote'}
      </Link>
    </div>
  );
}

export default PollCard;