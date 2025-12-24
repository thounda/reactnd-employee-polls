/**
 * File: src/components/Nav.js
 * Description: 
 * The single source of truth for application navigation. 
 * Replaces NavBar.js and Navigation.js.
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAuthedUser } from '../actions/authedUser'; 
import { LogOut, LayoutDashboard, Trophy, PlusSquare } from 'lucide-react';

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const authedUserId = useSelector((state) => state.authedUser);
  const users = useSelector((state) => state.users);
  const authedUser = authedUserId ? users[authedUserId] : null;

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutAuthedUser());
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'New Poll', path: '/add', icon: PlusSquare },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  const linkClassName = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand & Desktop Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl">
                P
              </div>
              <span className="font-black text-gray-900 hidden md:block tracking-tight">
                POLL MASTER
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className={linkClassName}>
                  <link.icon size={18} />
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4">
            {authedUser && (
              <>
                <div className="flex items-center gap-3 pr-2 border-r border-gray-100">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Logged in as</p>
                    <p className="text-sm font-black text-gray-800">{authedUser.name}</p>
                  </div>
                  <img
                    src={authedUser.avatarURL}
                    alt={authedUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-50 border-2 border-white shadow-sm"
                  />
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Bar (Optional improvement for mobile UX) */}
      <div className="md:hidden flex justify-around p-2 bg-gray-50 border-t border-gray-200">
        {navLinks.map((link) => (
          <NavLink key={link.path} to={link.path} className={linkClassName}>
            <link.icon size={20} />
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Nav;