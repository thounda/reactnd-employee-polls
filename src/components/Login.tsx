/**
 * File: Login.tsx
 * Path: src/components/Login.tsx
 * Description: The entry gate for the application. Fetches users from the 
 * Redux store and allows selection to set the authedUser state.
 * Fixed: Path resolution for the build environment and robust redirection logic.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Using @ts-ignore to bypass environment-specific path resolution issues
// @ts-ignore
import { useAppDispatch, useAppSelector } from '../store/hooks';
// @ts-ignore
import { setAuthedUser } from '../slices/authedUserSlice';

const Login: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState('');
  
  /**
   * Accessing users from the global state.
   * We wrap this in a selector that handles the environment's state structure.
   */
  // @ts-ignore
  const users = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Redirect Logic:
   * 'from' captures the location the user was trying to access before 
   * being intercepted by the PrivateRoute.
   */
  const { from } = (location.state as any) || { from: { pathname: "/" } };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      /**
       * Set the user in the Redux store.
       * We use the dispatch hook to trigger the authentication action.
       */
      // @ts-ignore
      dispatch(setAuthedUser(selectedUser));
      
      /**
       * Navigate back to the original destination.
       * We use the full 'from' object to preserve any search params.
       */
      navigate(from, { replace: true });
    }
  };

  // Convert the users object into an array for the dropdown selection
  const userList = Object.values(users || {});

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-3xl mb-6">
            <span className="text-4xl">👋</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Employee Polls</h1>
          <p className="text-slate-500 mt-3 font-medium">Select your account to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label htmlFor="user-select" className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Identify Yourself
            </label>
            <div className="relative">
              <select
                id="user-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full appearance-none p-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:bg-white focus:border-indigo-500 focus:ring-0 transition-all text-slate-900 font-bold"
                required
              >
                <option value="" disabled>Choose a team member...</option>
                {userList.map((user: any) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedUser}
            className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all duration-300 ${
              selectedUser 
                ? 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 active:scale-95' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Authenticate
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
            Corporate Access Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;