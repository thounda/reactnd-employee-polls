/**
 * File: src/components/Nav.js
 * Description: 
 * Updated to use inline SVGs instead of lucide-react to resolve resolution errors.
 * The single source of truth for application navigation. 
 * * NOTE: The "Could not resolve" errors in this preview panel are expected.
 * This environment cannot access your local project's 'react-redux' library
 * or your custom actions folder.
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAuthedUser } from '../actions/authedUser'; 

// Inline SVG Icons to replace lucide-react dependency issues
const Icons = {
  LayoutDashboard: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  ),
  Trophy: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
  ),
  PlusSquare: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
  ),
  LogOut: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  )
};

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
    { name: 'Home', path: '/', icon: Icons.LayoutDashboard },
    { name: 'New Poll', path: '/add', icon: Icons.PlusSquare },
    { name: 'Leaderboard', path: '/leaderboard', icon: Icons.Trophy },
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
                >
                  <Icons.LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
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