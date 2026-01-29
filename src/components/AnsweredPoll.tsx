import React from 'react';

/**
 * FILE: src/components/AnsweredPoll.tsx
 * DESCRIPTION: A presentational component displaying poll statistics.
 * Refactored to match the premium design language of the new QuestionPage.
 */

interface PollOption {
  votes: string[];
  text: string;
}

interface Question {
  optionOne: PollOption;
  optionTwo: PollOption;
  id?: string;
  author?: string;
  timestamp?: number;
}

interface AnsweredPollProps {
  question: Question;
  authedUser: string;
}

const AnsweredPoll: React.FC<AnsweredPollProps> = ({ question, authedUser }) => {
  const optionOneVotes = question.optionOne.votes.length;
  const optionTwoVotes = question.optionTwo.votes.length;
  const totalVotes = optionOneVotes + optionTwoVotes;

  const userSelected = question.optionOne.votes.includes(authedUser)
    ? 'optionOne'
    : question.optionTwo.votes.includes(authedUser)
    ? 'optionTwo'
    : null;

  const calculatePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const renderOptionResult = (
    option: 'optionOne' | 'optionTwo', 
    votes: number, 
    isUserChoice: boolean
  ) => {
    const pct = calculatePercentage(votes);
    const text = question[option].text;
    const label = option === 'optionOne' ? 'Alpha' : 'Beta';

    return (
      <div 
        key={option} 
        className={`relative p-8 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${
          isUserChoice 
            ? 'border-indigo-500 bg-indigo-50/30 shadow-xl shadow-indigo-100/50' 
            : 'border-slate-50 bg-slate-50/50'
        }`}
      >
        {isUserChoice && (
          <div className="absolute -top-3 left-8 bg-indigo-600 text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg z-10">
            Your Decision
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <h3 className={`text-lg font-bold uppercase tracking-tight leading-tight max-w-[70%] ${
            isUserChoice ? 'text-indigo-900' : 'text-slate-600'
          }`}>
            {text}
          </h3>
          <span className="text-2xl font-black text-slate-900">{pct}%</span>
        </div>
        
        <div className="relative h-3 w-full bg-slate-200/50 rounded-full overflow-hidden mb-4">
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${
              isUserChoice ? 'bg-indigo-600' : 'bg-slate-400'
            }`} 
            style={{ width: `${pct}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
          <span className={isUserChoice ? 'text-indigo-500' : ''}>
            {votes} {votes === 1 ? 'Participant' : 'Participants'}
          </span>
          <span>Selection {label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2 mb-8">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Final Tallies</span>
        <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Results</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {renderOptionResult('optionOne', optionOneVotes, userSelected === 'optionOne')}
        {renderOptionResult('optionTwo', optionTwoVotes, userSelected === 'optionTwo')}
      </div>

      <div className="pt-10 flex flex-col items-center">
        <div className="h-1 w-12 bg-slate-100 rounded-full mb-4"></div>
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">
          Total Participation: {totalVotes}
        </p>
      </div>
    </div>
  );
};

export default AnsweredPoll;