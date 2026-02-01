import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { handleAddAnswer } from '../slices/questionsSlice';
import { RootState, AppDispatch } from '../store/store';

/**
 * FILE: src/components/QuestionDetail.tsx
 * DESCRIPTION: 
 * Displays poll details and handles voting logic.
 * The fix addresses the "Argument of type AsyncThunkAction... is not assignable to UnknownAction" 
 * error by explicitly typing the dispatch hook as AppDispatch.
 */

interface QuestionDetailProps {
  questionId?: string;
  onNavigate?: (path: string) => void;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({ questionId: propId, onNavigate }) => {
  const { question_id: routeId } = useParams() as { question_id: string };
  const navigate = useNavigate();
  
  // FIX: Explicitly typing the dispatch hook ensures it can handle Thunks
  const dispatch: AppDispatch = useDispatch();

  const { authedUser, questions, users } = useSelector((state: RootState) => {
    // Handle both object and string formats for authedUser
    const rawAuth = state.authedUser;
    let authId: string | null = null;
    if (typeof rawAuth === 'string') {
      authId = rawAuth;
    } else if (rawAuth && typeof rawAuth === 'object') {
      authId = (rawAuth as any).id || (rawAuth as any).value || null;
    }

    return {
      authedUser: authId,
      questions: state.questions || {},
      users: state.users || {}
    };
  });

  const questionId = propId || routeId;
  const question = questionId ? questions[questionId] : null;

  useEffect(() => {
    if (!question && questionId) {
      if (onNavigate) {
        onNavigate('dashboard');
      } else {
        navigate('/404');
      }
    }
  }, [question, questionId, navigate, onNavigate]);

  if (!question || !authedUser) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic">404</h2>
        <p className="text-slate-500 mt-3 mb-10">Poll not found.</p>
        <button 
          onClick={() => (onNavigate ? onNavigate('dashboard') : navigate('/'))}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const author = users[question.author];
  const hasVotedOptionOne = question.optionOne.votes.includes(authedUser);
  const hasVotedOptionTwo = question.optionTwo.votes.includes(authedUser);
  const hasVoted = hasVotedOptionOne || hasVotedOptionTwo;

  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;
  const optOnePct = totalVotes === 0 ? 0 : Math.round((question.optionOne.votes.length / totalVotes) * 100);
  const optTwoPct = totalVotes === 0 ? 0 : Math.round((question.optionTwo.votes.length / totalVotes) * 100);

  const handleVote = (answer: 'optionOne' | 'optionTwo') => {
    if (!hasVoted && questionId) {
      // With AppDispatch typed above, this thunk action will now be accepted
      dispatch(handleAddAnswer({
        authedUser,
        qid: questionId,
        answer
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Author Header */}
        <div className="bg-slate-900 p-10 flex flex-col md:flex-row items-center justify-between text-white gap-6">
          <div className="flex items-center gap-6">
            <img 
              src={author?.avatarURL} 
              alt={author?.name}
              className="w-20 h-20 rounded-2xl bg-white p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || 'User')}`;
              }}
            />
            <div>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Author</p>
              <h2 className="text-2xl font-black">{author?.name}</h2>
            </div>
          </div>
          <button 
            onClick={() => (onNavigate ? onNavigate('dashboard') : navigate('/'))}
            className="px-6 py-2 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            ← Back
          </button>
        </div>

        <div className="py-12 px-8 text-center">
          <h2 className="text-4xl font-black text-slate-900 italic uppercase">Would You Rather...</h2>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {['optionOne', 'optionTwo'].map((optKey) => {
            const key = optKey as 'optionOne' | 'optionTwo';
            const option = question[key];
            const isSelected = (key === 'optionOne' && hasVotedOptionOne) || (key === 'optionTwo' && hasVotedOptionTwo);
            const percent = key === 'optionOne' ? optOnePct : optTwoPct;

            return (
              <div 
                key={key}
                onClick={() => !hasVoted && handleVote(key)}
                className={`relative p-10 rounded-[2.5rem] border-4 transition-all ${
                  !hasVoted ? 'cursor-pointer hover:border-indigo-500' : 'cursor-default'
                } ${isSelected ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100'}`}
              >
                <p className="text-xl font-black text-slate-800">{option.text}</p>
                {hasVoted && (
                  <div className="mt-6">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-3xl font-black text-indigo-600">{percent}%</span>
                      <span className="text-[10px] font-black text-slate-400">{option.votes.length} Votes</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;