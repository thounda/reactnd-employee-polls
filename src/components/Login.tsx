/**
 * File: Login.tsx
 * Path: src/components/Login.tsx
 * Description: 
 * This component provides a user selection interface for authentication. 
 * It pulls the list of available users from the Redux store and updates 
 * the 'authedUser' state upon selection. It also handles redirection 
 * back to the page the user originally tried to visit before being blocked by auth.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setAuthedUser } from '../slices/authedUserSlice';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get users from Redux state
  const users = useAppSelector((state: any) => state.users);
  const userList = Object.values(users || {});
  
  const [selectedUserId, setSelectedUserId] = useState('');

  // Redirection logic: identifies where the user was trying to go
  const { from } = (location.state as { from: { pathname: string } }) || { from: { pathname: '/' } };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      // Set the global auth state
      dispatch(setAuthedUser(selectedUserId));
      // Navigate back to the intended destination or home
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-full bg-indigo-50 mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-2-2m0 0l2-2m-2 2h8m-9 3h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Employee Polls</h1>
          <p className="mt-2 text-gray-500">Please select an account to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="user-select" className="block text-sm font-semibold text-gray-700 mb-2">
              Select User
            </label>
            <div className="relative">
              <select
                id="user-select"
                data-testid="user-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none"
              >
                <option value="" disabled>Choose a team member...</option>
                {userList.length > 0 ? (
                  userList.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No users loaded yet...</option>
                )}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedUserId}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all ${
              selectedUserId 
                ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform active:scale-[0.98]' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">
            Internal Portal
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;