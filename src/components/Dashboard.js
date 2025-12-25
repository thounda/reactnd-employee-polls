/**
 * File: src/components/Dashboard.js
 * Description: Displays the main question feeds, categorized into Unanswered and Answered polls.
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// Inline SVG replacements for Lucide icons to prevent dependency errors
const IconHelp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
);

const IconChevron = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

const QuestionCard = ({ question, author }) => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
    <div className="p-1 bg-indigo-50 border-b border-gray-100 flex items-center justify-center">
      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest py-1">Would You Rather</span>
    </div>
    <div className="p-5 flex items-start space-x-4">
      <img 
        src={author?.avatarURL} 
        alt={author?.name} 
        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 truncate">{author?.name}</h4>
        <p className="text-xs text-gray-400 mb-3">{new Date(question.timestamp).toLocaleDateString()}</p>
        <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 italic border border-gray-100 line-clamp-1">
          "...{question.optionOne.text}..."
        </div>
      </div>
    </div>
    <button className="w-full py-3 px-4 bg-white border-t border-gray-100 text-indigo-600 text-xs font-black uppercase tracking-wider flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
      Show Poll <span className="ml-2"><IconChevron /></span>
    </button>
  </div>
);

const Dashboard = () => {
  const [tab, setTab] = useState('unanswered');
  const authedUser = useSelector((state) => state.authedUser);
  const questions = useSelector((state) => state.questions);
  const users = useSelector((state) => state.users);

  const questionList = Object.values(questions).sort((a, b) => b.timestamp - a.timestamp);

  const unanswered = questionList.filter(
    (q) => !q.optionOne.votes.includes(authedUser) && !q.optionTwo.votes.includes(authedUser)
  );

  const answered = questionList.filter(
    (q) => q.optionOne.votes.includes(authedUser) || q.optionTwo.votes.includes(authedUser)
  );

  const currentQuestions = tab === 'unanswered' ? unanswered : answered;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Polls Dashboard</h2>
          <p className="text-gray-500 text-sm">Review questions or check your progress.</p>
        </div>

        <div className="inline-flex p-1 bg-gray-200/50 backdrop-blur-sm rounded-2xl">
          <button
            onClick={() => setTab('unanswered')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'unanswered' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            New Questions
          </button>
          <button
            onClick={() => setTab('answered')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'answered' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Answered
          </button>
        </div>
      </div>

      {currentQuestions.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconHelp />
          </div>
          <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            {tab === 'unanswered' 
              ? "You've answered every question. Why not create a new one?" 
              : "You haven't answered any questions yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentQuestions.map((question) => (
            <QuestionCard 
              key={question.id} 
              question={question} 
              author={users[question.author]} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;