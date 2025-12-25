/**
 * File: src/App.js
 * Description: Main entry point for the "Would You Rather" Application.
 * * NOTE: The "Could not resolve" errors in this preview panel are expected.
 * This file relies on a local Redux setup (actions/reducers) and modular 
 * components (Dashboard) that exist in your local VS Code project directory
 * but are not present in this single-file preview environment.
 */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleInitialData } from './actions/shared';
import { setAuthedUser } from './actions/authedUser';
import Dashboard from './components/Dashboard';

// Inline SVG Icon Components to ensure the app is self-contained for icons
const IconHelp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
);
const IconLogin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
);
const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);
const IconTrophy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
);
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="15" rx="1"/></svg>
);

const App = () => {
  const dispatch = useDispatch();
  const authedUser = useSelector((state) => state.authedUser);
  const users = useSelector((state) => state.users);
  const [view, setView] = useState('dashboard');

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

  // Login View
  if (!authedUser) {
    const userList = users ? Object.values(users) : [];
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-indigo-600 p-10 text-center text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconHelp />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Would You Rather?</h1>
            <p className="text-indigo-100 text-sm mt-2 opacity-90">Please sign in to continue</p>
          </div>
          <div className="p-8 space-y-3">
            {userList.length === 0 ? (
              <p className="text-center text-gray-400 py-4">Loading users...</p>
            ) : (
              userList.map((user) => (
                <button 
                  key={user.id} 
                  onClick={() => handleLogin(user.id)} 
                  className="w-full flex items-center p-4 rounded-2xl border-2 border-gray-50 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left group"
                >
                  <img src={user.avatarURL} alt={user.name} className="w-12 h-12 rounded-full mr-4 shadow-sm" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 group-hover:text-indigo-700">{user.name}</p>
                    <p className="text-xs text-gray-400">@{user.id}</p>
                  </div>
                  <IconLogin />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentUser = users[authedUser];

  // Authenticated View
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setView('dashboard')} 
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-colors ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
            >
              <IconHome /> <span className="ml-2 hidden sm:inline">Home</span>
            </button>
            <button 
              onClick={() => setView('add')} 
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-colors ${view === 'add' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
            >
              <IconPlus /> <span className="ml-2 hidden sm:inline">New Poll</span>
            </button>
            <button 
              onClick={() => setView('leaderboard')} 
              className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-colors ${view === 'leaderboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}
            >
              <IconTrophy /> <span className="ml-2 hidden sm:inline">Leaderboard</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-900 hidden md:block">{currentUser?.name}</span>
              <img src={currentUser?.avatarURL} alt={currentUser?.name} className="w-8 h-8 rounded-full border border-gray-100" />
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
              <IconLogout />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'dashboard' && <Dashboard />}
        {view === 'add' && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <h2 className="text-xl font-bold">New Poll View</h2>
            <p className="text-gray-500">Form implementation coming next.</p>
          </div>
        )}
        {view === 'leaderboard' && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <h2 className="text-xl font-bold">Leaderboard View</h2>
            <p className="text-gray-500">Ranking implementation coming next.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;