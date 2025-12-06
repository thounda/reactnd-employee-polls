/**
 * File: src/components/Login.js
 * Description: The application login screen. Allows the user to select an ID
 * and enter a password to authenticate. On success, it sets the authenticated user in Redux.
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { setAuthedUser } from '../actions/authedUser.js';

function Login() {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Get all users and the current authenticated user ID from the Redux store
  const users = useSelector((state) => state.users);
  const authedUser = useSelector((state) => state.authedUser);
  
  // Local state for form inputs
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already authenticated, redirect them to the previous page or home
  if (authedUser) {
    // Redirect to the path they were trying to access, or to the dashboard
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedUser) {
      setError('Please select a user to log in.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }

    // --- Authentication Logic ---
    const userToLogin = users[selectedUser];
    
    // NOTE: In a real app, this would be an async API call. 
    // Since we are simulating the backend with _DATA.js, we check the password directly.
    if (userToLogin && userToLogin.password === password) {
      dispatch(setAuthedUser(selectedUser));
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  // Prepare user options for the dropdown
  const userOptions = Object.values(users).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex justify-center items-center p-4 min-h-full">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:shadow-3xl duration-300">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white text-center rounded-t-xl">
          <h1 className="text-3xl font-bold mb-1">Employee Polls</h1>
          <p className="text-indigo-200">Please sign in to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          
          {/* Error Message Display */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm transition-opacity duration-300 animate-fadeIn">
              {error}
            </div>
          )}

          {/* User Selection Dropdown */}
          <div className="space-y-2">
            <label htmlFor="userSelect" className="block text-lg font-medium text-gray-700">Select User</label>
            <div className="relative">
              <select
                id="userSelect"
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setError(''); // Clear error on new selection
                }}
                className="block w-full py-3 px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base appearance-none transition duration-150"
              >
                <option value="" disabled>Select an employee...</option>
                {userOptions.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.id})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 12.121z"/></svg>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter password"
              className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-150"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 transform hover:scale-[1.01]"
              disabled={!selectedUser || !password}
            >
              Sign In
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-500 pt-2">
            Try: <span className="font-semibold text-indigo-500">sarahedo</span> with password <span className="font-semibold text-indigo-500">password123</span>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;