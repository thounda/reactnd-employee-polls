import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * File: src/components/QuestionDetail.tsx
 * Purpose: Detailed view for a single poll, allowing voting or displaying results.
 * Fix: Updated thunk name from 'handleAnswerQuestion' to 'handleAddAnswer' to match slice.
 * Note for Preview Environment: The @ts-ignore markers are kept to bypass
 * environment-specific resolution issues while maintaining correct production paths.
 */

/* --- START: PRODUCTION CODE (Use this for VS Code) --- */
// @ts-ignore
import { useAppDispatch, useAppSelector } from '../store/hooks';
// @ts-ignore
import { selectAuthedUser } from '../slices/authedUserSlice';
// @ts-ignore
import { selectQuestions, handleAddAnswer } from '../slices/questionsSlice';
// @ts-ignore
import { selectUsers } from '../slices/usersSlice';

const QuestionDetail: React.FC = () => {
  const { question_id } = useParams<{ question_id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Extract values from state
  const authedUser = useAppSelector(selectAuthedUser);
  const questions = useAppSelector(selectQuestions);
  const users = useAppSelector(selectUsers);

  // Guard: If we are still loading initial data or state is empty
  const isLoading = !questions || Object.keys(questions).length === 0 || !users || Object.keys(users).length === 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Poll Detail...</p>
      </div>
    );
  }

  // Find the specific question and author
  const question = question_id ? questions[question_id] : null;
  const author = question ? users[question.author] : null;

  // Handle 404 (Question ID not in state)
  if (!question || !author) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-12 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
        <h2 className="text-4xl font-black text-slate-900 mb-4">404</h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">The poll you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  // Determine if authedUser has already voted
  const hasAnswered = 
    question.optionOne.votes.includes(authedUser!) || 
    question.optionTwo.votes.includes(authedUser!);

  // Voting action - Using the correct thunk name 'handleAddAnswer'
  const handleVote = (answer: 'optionOne' | 'optionTwo') => {
    if (authedUser) {
      dispatch(handleAddAnswer({
        authedUser,
        qid: question.id,
        answer
      }));
    }
  };

  // Stats calculation
  const getVoteStats = (optionKey: 'optionOne' | 'optionTwo') => {
    const votes = question[optionKey].votes.length;
    const total = question.optionOne.votes.length + question.optionTwo.votes.length;
    const percentage = total === 0 ? 0 : Math.round((votes / total) * 100);
    const isVoted = question[optionKey].votes.includes(authedUser!);
    return { votes, total, percentage, isVoted };
  };

  const statsOne = getVoteStats('optionOne');
  const statsTwo = getVoteStats('optionTwo');

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        {/* Author Header */}
        <div className="bg-slate-50 p-8 flex items-center gap-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-white rounded-[1.25rem] overflow-hidden shadow-lg border-2 border-slate-200 p-1">
            <img 
              src={author.avatarURL} 
              alt={author.name} 
              className="w-full h-full object-cover rounded-[0.85rem]"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${author.name}`; }}
            />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{author.name} asks:</h2>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Would You Rather...</p>
          </div>
        </div>

        <div className="p-10">
          {!hasAnswered ? (
            /* Poll: Voting View */
            <div className="space-y-4">
              <button 
                onClick={() => handleVote('optionOne')}
                className="w-full group p-8 rounded-[2rem] border-2 border-slate-50 bg-slate-50 hover:border-indigo-500 hover:bg-white transition-all duration-300 text-left"
              >
                <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Option A</span>
                <span className="block text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{question.optionOne.text}</span>
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center"><span className="bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">OR</span></div>
              </div>

              <button 
                onClick={() => handleVote('optionTwo')}
                className="w-full group p-8 rounded-[2rem] border-2 border-slate-50 bg-slate-50 hover:border-indigo-500 hover:bg-white transition-all duration-300 text-left"
              >
                <span className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Option B</span>
                <span className="block text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{question.optionTwo.text}</span>
              </button>
            </div>
          ) : (
            /* Poll: Results View */
            <div className="space-y-6">
              {[
                { label: 'Option A', text: question.optionOne.text, stats: statsOne },
                { label: 'Option B', text: question.optionTwo.text, stats: statsTwo }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`relative p-8 rounded-[2rem] border-2 transition-all duration-500 ${
                    item.stats.isVoted 
                      ? 'border-indigo-500 bg-indigo-50/30' 
                      : 'border-slate-50 bg-slate-50'
                  }`}
                >
                  {item.stats.isVoted && (
                    <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest py-2 px-4 rounded-full shadow-lg shadow-indigo-200">
                      Your Vote
                    </div>
                  )}
                  <span className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${item.stats.isVoted ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                  <p className="text-lg font-black text-slate-900 mb-6">{item.text}</p>
                  
                  <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden mb-3">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${item.stats.isVoted ? 'bg-indigo-600' : 'bg-slate-400'}`}
                      style={{ width: `${item.stats.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-slate-900">{item.stats.percentage}%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {item.stats.votes} out of {item.stats.total} votes
                    </span>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => navigate('/')}
                className="w-full mt-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
/* --- END: PRODUCTION CODE --- */