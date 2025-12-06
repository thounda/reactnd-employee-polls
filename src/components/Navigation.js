/**
 * File: src/components/Navigation.js
 * Description: The main navigation bar for the application. Displays links,
 * the authenticated user's name and avatar, and a logout button.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAuthedUser } from '../actions/authedUser.js';
import Avatar from './Avatar.js';

function Navigation() {
  const dispatch = useDispatch();
  
  // Get the authedUser ID and the full users object from the store
  const authedUserId = useSelector((state) => state.authedUser);
  const users = useSelector((state) => state.users);

  // Get the current user's details, or null if not logged in
  const authedUser = authedUserId ? users[authedUserId] : null;

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutAuthedUser());
  };

  // Function for dynamic NavLink styling
  const linkClassName = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-lg font-medium transition duration-150 ${
      isActive
        ? 'bg-indigo-700 text-white shadow-md'
        : 'text-indigo-200 hover:text-white hover:bg-indigo-800'
    }`;

  return (
    <nav className="bg-indigo-600 shadow-xl sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Side: Navigation Links */}
          <div className="flex space-x-4">
            <NavLink to="/" className={linkClassName}>
              Home
            </NavLink>
            <NavLink to="/add" className={linkClassName}>
              New Poll
            </NavLink>
            <NavLink to="/leaderboard" className={linkClassName}>
              Leaderboard
            </NavLink>
          </div>

          {/* Right Side: User Info & Logout (Only visible when logged in) */}
          {authedUser && (
            <div className="flex items-center space-x-4 text-white">
              
              {/* User Avatar */}
              <Avatar url={authedUser.avatarURL} name={authedUser.name} size="w-10 h-10" />

              {/* User Name */}
              <span className="text-lg font-semibold hidden sm:inline">
                Hello, {authedUser.name}
              </span>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="py-2 px-3 border border-indigo-400 rounded-lg text-sm font-medium text-indigo-100 bg-indigo-700 hover:bg-red-700 hover:border-red-600 transition duration-150 shadow-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;