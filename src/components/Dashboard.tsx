import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * File: src/components/Dashboard.tsx
 * Purpose: Main landing page for authenticated users.
 * Enhancements: Added poll previews (excerpts) to increase click-through engagement.
 * Note for Preview Environment: The @ts-ignore markers are kept to bypass
 * environment-specific resolution issues while maintaining correct production paths.
 */

/* --- START: PRODUCTION CODE (Use this for VS Code) --- */
// @ts-ignore
import { useAppSelector } from '../store/hooks';
// @ts-ignore
import { selectAuthedUser } from '../slices/authedUserSlice';
// @ts-ignore
import { selectQuestions } from '../slices/questionsSlice';
// @ts-ignore
import { selectUsers } from '../slices/usersSlice';

const Dashboard: React.FC = () => {
  const [showAnswered, setShowAnswered] = useState(false);

  const authedUser = useAppSelector(selectAuthedUser);
  const questions = useAppSelector(selectQuestions);
  const users = useAppSelector(selectUsers);

  if (!authedUser || !questions || !users) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const userId = authedUser;

  const questionIds = Object.keys(questions).sort(
    (a, b) => questions[b].timestamp - questions[a].timestamp
  );

  const unanswered = questionIds.filter(
    (id) =>
      !questions[id].optionOne.votes.includes(userId) &&
      !questions[id].optionTwo.votes.includes(userId)
  );

  const answered = questionIds.filter(
    (id) =>
      questions[id].optionOne.votes.includes(userId) ||
      questions[id].optionTwo.votes.includes(userId)
  );

  const displayList = showAnswered ? answered : unanswered;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        {/* Toggle Navigation */}
        <div className="flex bg-slate-50/80 p-3 gap-3">
          <button
            onClick={() => setShowAnswered(false)}
            className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all duration-300 ${
              !showAnswered 
                ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100/50 scale-[1.02]' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unanswered Questions
            <span className="ml-3 opacity-50">({unanswered.length})</span>
          </button>
          <button
            onClick={() => setShowAnswered(true)}
            className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] transition-all duration-300 ${
              showAnswered 
                ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100/50 scale-[1.02]' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            Answered Questions
            <span className="ml-3 opacity-50">({answered.length})</span>
          </button>
        </div>

        {/* Question List Content */}
        <div className="p-10">
          {displayList.length === 0 ? (
            <div className="text-center py-20 text-slate-300 italic uppercase text-[10px] tracking-widest">
              No {showAnswered ? 'answered' : 'unanswered'} questions found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayList.map((id) => {
                const question = questions[id];
                const author = users[question.author];
                const teaserText = question.optionOne.text;
                
                return (
                  <div 
                    key={id} 
                    className="group border border-slate-100 p-8 rounded-[2.5rem] hover:border-indigo-200 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] transition-all duration-500 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 shadow-xl overflow-hidden group-hover:bg-indigo-600 transition-colors duration-500">
                           <img
                            src={author?.avatarURL}
                            alt={author?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${author?.name}&background=random`;
                            }}
                          />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{author?.name} asks:</h4>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">
                            {new Date(question.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <h3 className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
                        Would you rather...
                      </h3>
                      
                      {/* Teaser Text Section */}
                      <div className="mb-8">
                        <p className="text-lg font-black text-slate-900 italic tracking-tighter leading-tight">
                          "{teaserText.length > 40 ? teaserText.substring(0, 40) + '...' : teaserText}"
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-[1px] flex-1 bg-slate-100"></div>
                          <span className="text-[9px] font-black text-indigo-300 uppercase italic">OR...?</span>
                          <div className="h-[1px] flex-1 bg-slate-100"></div>
                        </div>
                      </div>
                    </div>

                    <Link 
                      to={`/questions/${id}`}
                      className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-200 group-hover:shadow-indigo-200 text-center block"
                    >
                      {showAnswered ? 'View Results' : 'Vote Now'}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
/* --- END: PRODUCTION CODE --- */