/**
 * File: src/components/Login.js
 * Description: 
 * A functional component for user authentication.
 * Fixed stray '}' character in JSX and corrected import paths.
 * * NOTE: The "Could not resolve" errors in this preview panel are expected
 * as the environment cannot access your local project's 'react-redux'
 * or the actions folder.
 */

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// Importing the setAuthedUser action from the correct local path
import { setAuthedUser } from "../actions/authedUser";

const Login = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const dispatch = useDispatch();
  
  // Access users from Redux store
  const users = useSelector((state) => state.users || {});
  const userIds = Object.keys(users);

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedUser) {
      dispatch(setAuthedUser(selectedUser));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-indigo-100 shadow-lg">
            P
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Please select an employee to login
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm">
            <label htmlFor="user-select" className="sr-only">
              Employee
            </label>
            <select
              id="user-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 transition-all font-bold"
            >
              <option value="" disabled>
                Select Employee...
              </option>
              {userIds.map((id) => (
                <option key={id} value={id}>
                  {users[id].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={!selectedUser}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-xl text-white transition-all duration-200 ${
                selectedUser 
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5" 
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Sign In
            </button>
          </div>
        </form>
        
        <div className="pt-4 text-center">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            Employee Polls Project
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;