/**
 * File: src/App.js
 * Description: Main entry point for the "Would You Rather" Application.
 * This version is configured for VS Code using Redux state management.
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleInitialData } from './actions/shared';
import { setAuthedUser } from './actions/authedUser';
import { 
  LogIn, 
  HelpCircle, 
  Trophy, 
  LogOut, 
  ChevronRight, 
  PlusCircle, 
  LayoutDashboard 
} from 'lucide-react';

/**
 * QuestionCard Component
 * Displays summary of the poll on the Dashboard
 */
const QuestionCard = ({ question, author }) => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
    <div className="p-1 bg-indigo-50 border-b border-gray-100 flex items-center justify-center">
      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest py-1">Would You Rather</span>
    </div>
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <img src={author.avatarURL} alt={author.name} className="w-10 h-10 rounded-full bg-gray-100" />
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-gray-900 truncate">{author.name} asks:</p>
          <p className="text-xs text-gray-400 truncate">...{question.optionOne.text}...</p>
        </div>
      </div>
      <button className="w-full py-2.5 px-4 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center group-hover:scale-[1.02]">
        View Poll <ChevronRight className="ml-1 w-4 h-4" />
      </button>
    </div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const authedUser = useSelector((state) => state.authedUser);
  const users = useSelector((state) => state.users);
  const questions = useSelector((state) => state.questions);

  // Local state for UI navigation/tabs
  const [activeTab, setActiveTab] = React.useState('unanswered');
  const [view, setView] = React.useState('dashboard');

  useEffect(() => {
    dispatch(handleInitialData());
  }, [dispatch]);

  const handleLogin = (userId) => {
    dispatch(setAuthedUser(userId));
  };

  const handleLogout = () => {
    dispatch(setAuthedUser(null));
    setView('dashboard');
  };

  if (!authedUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 p-10 text-center text-white">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-black">Would You Rather?</h1>
            <p className="text-indigo-100 text-sm mt-2 opacity-90">Please sign in to continue</p>
          </div>
          <div className="p-8">
            <div className="space-y-3">
              {users && Object.values(users).map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleLogin(user.id)}
                  className="w-full flex items-center p-4 rounded-2xl border-2 border-gray-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group text-left"
                >
                  <img src={user.avatarURL} alt={user.name} className="w-12 h-12 rounded-full bg-gray-100 mr-4 shadow-sm" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 group-hover:text-indigo-700">{user.name}</p>
                    <p className="text-xs text-gray-400">@{user.id}</p>
                  </div>
                  <LogIn className="w-5 h-5 text-gray-300 group-hover:text-indigo-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortedQuestionIds = questions ? Object.keys(questions).sort(
    (a, b) => questions[b].timestamp - questions[a].timestamp
  ) : [];

  const unanswered = sortedQuestionIds.filter(id => 
    !questions[id].optionOne.votes.includes(authedUser) &&
    !questions[id].optionTwo.votes.includes(authedUser)
  );

  const answered = sortedQuestionIds.filter(id => 
    questions[id].optionOne.votes.includes(authedUser) ||
    questions[id].optionTwo.votes.includes(authedUser)
  );

  const currentList = activeTab === 'unanswered' ? unanswered : answered;
  const user = users ? users[authedUser] : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 mr-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-gray-900 tracking-tight">WYR?</span>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => setView('dashboard')} 
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />Home
              </button>
              <button 
                onClick={() => setView('add')} 
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center ${view === 'add' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
              >
                <PlusCircle className="w-4 h-4 mr-2" />New Poll
              </button>
              <button 
                onClick={() => setView('leaderboard')} 
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center ${view === 'leaderboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
              >
                <Trophy className="w-4 h-4 mr-2" />Leaderboard
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 pr-4 border-r border-gray-100">
              <span className="text-sm font-bold text-gray-900">{user?.name}</span>
              <img src={user?.avatarURL} alt={user?.name} className="w-9 h-9 rounded-full bg-gray-100" />
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'dashboard' && (
          <>
            <div className="flex mb-8">
              <div className="inline-flex bg-gray-200/50 p-1 rounded-2xl">
                <button 
                  onClick={() => setActiveTab('unanswered')} 
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'unanswered' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Unanswered
                </button>
                <button 
                  onClick={() => setActiveTab('answered')} 
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'answered' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Answered
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentList.map(id => (
                <QuestionCard 
                  key={id} 
                  question={questions[id]} 
                  author={users[questions[id].author]} 
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;