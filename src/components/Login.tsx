/**
 * @file src/components/Login.tsx
 * @description
 * Login component for user authentication.
 * Optimized for local VS Code usage with preview fallbacks.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { setAuthedUser } from '../actions/authedUser';
import { RootState } from '../store/store';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  /**
   * Memoized-style selection to avoid the "Selector unknown" warning.
   * We pull stable references for keys and the object itself.
   */
  const userIds = useSelector((state: any) => {
    const users = state.users || {};
    return Object.keys(users);
  });
  
  const users = useSelector((state: any) => state.users || {});

  const [selectedUser, setSelectedUser] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      dispatch(setAuthedUser(selectedUser));
      
      // Navigate to the 'from' location or default to home
      const { from } = (location.state as any) || { from: { pathname: '/' } };
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employee Polls</h1>
          <p className="text-slate-500 mt-2">Please sign in to continue</p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="bg-indigo-50 p-4 rounded-full">
            <img 
              src="https://img.icons8.com/clouds/100/000000/manager.png" 
              alt="Login Logo" 
              className="w-20 h-20"
            />
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="user-select" className="block text-sm font-semibold text-slate-700 mb-2">
              Select User
            </label>
            <select
              id="user-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none"
            >
              <option value="" disabled>Choose a user...</option>
              {userIds.map((id: string) => (
                <option key={id} value={id}>
                  {users[id]?.name || id}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!selectedUser}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 active:transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;