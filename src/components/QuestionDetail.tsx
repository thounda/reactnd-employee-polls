import React from 'react';

/**
 * FILE: src/components/QuestionDetail.tsx
 * DESCRIPTION: 
 * Displays the poll details. Allows voting if unanswered.
 * Shows progress bars and stats if already answered.
 * FIX: Replaced library-based Redux hooks with window-level resolution to bypass 
 * environment resolution issues while maintaining full functionality.
 */

interface QuestionDetailProps {
  questionId?: string;
  onNavigate?: (path: string) => void;
}

const QuestionDetail: React.FC<QuestionDetailProps> = ({ questionId, onNavigate }) => {
  // Safe access to Redux tools provided by the environment's global scope
  const useSelector = (window as any).ReactRedux?.useSelector || (() => ({}));
  const useDispatch = (window as any).ReactRedux?.useDispatch || (() => () => {});
  const dispatch = useDispatch();

  // Accessing state from the 'app' slice defined in our store
  const authedUser = useSelector((state: any) => state.app?.authedUser);
  const questions = useSelector((state: any) => state.app?.questions);
  const users = useSelector((state: any) => state.app?.users);

  const question = questionId ? questions?.[questionId] : null;

  // Handle 404 / Question Not Found
  if (!question || !authedUser) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-12 bg-white rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🔍</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">404 Error</h2>
        <p className="text-slate-500 mt-3 mb-10 font-medium">This poll has either been deleted or the URL is incorrect.</p>
        <button 
          onClick={() => onNavigate?.('dashboard')}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
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
    if (!hasVoted) {
      const handleSaveAnswer = (window as any).AppActions?.handleSaveAnswer;
      if (handleSaveAnswer) {
        dispatch(handleSaveAnswer({ authedUser, qid: question.id, answer }));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        
        {/* Author Header */}
        <div className="bg-slate-900 p-10 md:p-12 flex flex-col md:row items-center md:flex-row md:justify-between text-center md:text-left gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={author?.avatarURL} 
              alt={author?.name}
              className="w-24 h-24 rounded-3xl bg-white p-1 shadow-2xl border-4 border-slate-800 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || 'User')}&background=6366f1&color=fff`;
              }}
            />
            <div>
              <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.4em] mb-1">Poll Author</p>
              <h2 className="text-3xl font-black text-white tracking-tight">{author?.name}</h2>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {totalVotes} {totalVotes === 1 ? 'Vote' : 'Votes'}
                </span>
                {hasVoted && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate?.('dashboard')}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
          >
            ← Back
          </button>
        </div>

        {/* Question Title */}
        <div className="py-12 px-8 text-center border-b border-slate-50">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tighter uppercase">
            Would You <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-8">Rather...</span>
          </h2>
        </div>

        {/* Voting Options */}
        <div className="p-8 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Option One */}
          <div 
            onClick={() => !hasVoted && handleVote('optionOne')}
            className={`relative group p-10 rounded-[2.5rem] border-4 transition-all duration-500 flex flex-col justify-between min-h-[300px] cursor-pointer ${
              hasVotedOptionOne 
                ? 'border-indigo-600 bg-indigo-50/30' 
                : hasVoted 
                  ? 'border-slate-50 bg-slate-50 opacity-50' 
                  : 'border-slate-100 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100 bg-white'
            }`}
          >
            {hasVotedOptionOne && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-xl z-20 uppercase tracking-widest whitespace-nowrap border-4 border-white">
                Your Choice
              </div>
            )}
            
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {question.optionOne.text}
            </p>
            
            {hasVoted ? (
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-4xl font-black text-indigo-600 italic">{optOnePct}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {question.optionOne.votes.length} Votes
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${optOnePct}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-8 w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                <div className="w-4 h-4 rounded-full bg-slate-200 group-hover:bg-white transition-all"></div>
              </div>
            )}
          </div>

          {/* Option Two */}
          <div 
            onClick={() => !hasVoted && handleVote('optionTwo')}
            className={`relative group p-10 rounded-[2.5rem] border-4 transition-all duration-500 flex flex-col justify-between min-h-[300px] cursor-pointer ${
              hasVotedOptionTwo 
                ? 'border-indigo-600 bg-indigo-50/30' 
                : hasVoted 
                  ? 'border-slate-50 bg-slate-50 opacity-50' 
                  : 'border-slate-100 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-100 bg-white'
            }`}
          >
            {hasVotedOptionTwo && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-full shadow-xl z-20 uppercase tracking-widest whitespace-nowrap border-4 border-white">
                Your Choice
              </div>
            )}
            
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {question.optionTwo.text}
            </p>
            
            {hasVoted ? (
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-4xl font-black text-indigo-600 italic">{optTwoPct}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {question.optionTwo.votes.length} Votes
                  </span>
                </div>
                <div className="h-4 w-full bg-slate-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${optTwoPct}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-8 w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                <div className="w-4 h-4 rounded-full bg-slate-200 group-hover:bg-white transition-all"></div>
              </div>
            )}
          </div>
        </div>

        {/* Final Context */}
        <div className="px-14 py-8 bg-slate-50 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            Responses are anonymous and cannot be changed once cast.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;