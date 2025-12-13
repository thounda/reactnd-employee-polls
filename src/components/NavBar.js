/**
 * File: src/components/NavBar.js
 * Description: The main navigation bar for the application.
 * Displays navigation links and, when authenticated, the user's name and a logout button.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Assuming setAuthedUser handles both login (id) and logout (null)
import { setAuthedUser } from '../actions/authedUser'; 

function NavBar() {
  const dispatch = useDispatch();
  const authedUser = useSelector((state) => state.authedUser);
  const users = useSelector((state) => state.users);

  // Get the complete user object for the authenticated user
  const user = authedUser ? users[authedUser] : null; 
  
  // Determine the display name and avatar URL
  const username = user?.name || 'Guest';
  // Use a fallback URL in case the user object is missing or avatarURL is not present
  const avatarURL = user?.avatarURL || 'https://placehold.co/40x40/6366F1/ffffff?text=U'; 

  /**
   * Handles the logout action by clearing the authedUser in Redux.
   */
  const handleLogout = () => {
    // Dispatch an action to set the authenticated user to null/empty string
    dispatch(setAuthedUser(null)); 
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 border-b-2 transition-all duration-200 ${
      isActive
        ? 'border-indigo-600 text-indigo-700 font-semibold'
        : 'border-transparent text-gray-600 hover:border-gray-300'
    }`;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Navigation Links */}
          <div className="flex space-x-4">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/add" className={linkClass}>
              New Poll
            </NavLink>
            <NavLink to="/leaderboard" className={linkClass}>
              Leaderboard
            </NavLink>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center">
            {authedUser ? (
              <div className="flex items-center space-x-4">
                
                {/* NEW: Avatar Display */}
                <img
                  src={avatarURL}
                  alt={`Avatar of ${username}`}
                  className="w-8 h-8 rounded-full object-cover border-2 border-indigo-400"
                />

                <span className="text-sm font-medium text-gray-800 hidden sm:block">
                  Hello, {username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm"
                  aria-label="Log out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                Log In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;