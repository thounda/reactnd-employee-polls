/**
 * FILE: src/components/Login.tsx
 * DESCRIPTION:
 * Enhanced login screen with user selection.
 * Directly connected to Redux for state management and visual feedback.
 * FIX: Adjusted import path and library references for environment compatibility.
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, setAuthedUser } from '../store/store.tsx';

const Login: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  
  // Connect to our central store
  const users = useSelector((state: RootState) => state.app.users);
  const userList = Object.values(users || {});
  const selectedUser = users ? users[selectedUserId] : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      dispatch(setAuthedUser(selectedUserId));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Branding Section */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] shadow-2xl shadow-indigo-200 flex items-center justify-center transform rotate-12 transition-transform hover:rotate-0 duration-500">
              <span className="text-white text-5xl font-black -rotate-12 group-hover:rotate-0 transition-transform">?</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="mt-8 text-4xl font-black text-slate-900 tracking-tight leading-none">
            Employee <span className="text-indigo-600">Polls</span>
          </h1>
          <p className="text-slate-500 mt-3 font-medium text-lg">Choose your persona to continue</p>
        </div>

        {/* Login Container */}
        <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label htmlFor="user-select" className="block text-sm font-bold text-slate-800 ml-1">
                  Select Employee Identity
                </label>
                
                {/* Visual Avatar Feedback */}
                <div className="flex justify-center mb-6">
                  {selectedUser ? (
                    <div className="relative animate-in zoom-in duration-300">
                      <img 
                        src={selectedUser.avatarURL} 
                        alt={selectedUser.name} 
                        className="w-20 h-20 rounded-full border-4 border-indigo-100 shadow-md object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-dashed border-slate-200 flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <select
                    id="user-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-800 text-base font-medium rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 block p-4 transition-all outline-none appearance-none cursor-pointer"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, 
                      backgroundRepeat: 'no-repeat', 
                      backgroundPosition: 'right 1.25rem center', 
                      backgroundSize: '1.25em' 
                    }}
                  >
                    <option value="" disabled>Search or select user...</option>
                    {userList.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedUserId}
                className={`group relative w-full py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-[0.98] shadow-xl overflow-hidden ${
                  selectedUserId 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">Sign In</span>
              </button>
            </form>
          </div>
          
          <div className="bg-slate-50 px-8 py-4 rounded-b-[2.5rem] border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Employee Portal</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
            </div>
          </div>
        </div>

        <p className="text-center mt-12 text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
          Internal Use Only • Secure Session
        </p>
      </div>
    </div>
  );
};

export default Login;