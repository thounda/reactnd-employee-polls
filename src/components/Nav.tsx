import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

/**
 * FILE: src/components/Nav.tsx
 * DESCRIPTION:
 * Premium Navigation bar featuring:
 * - Glassmorphism background effect.
 * - Active state indicators with bold underlines.
 * - User profile summary with quick-logout.
 * - Fixed TypeScript types for dynamic Redux resolution.
 */

interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: Record<string, string>;
  questions: string[];
}

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Safe Redux Integration with Explicit Typing
   * We cast the dynamically required hooks to avoid 'never' type errors.
   */
  let useSelector: <T>(selector: (state: any) => T) => T = (selector) => null as any;
  let useDispatch: () => (action: any) => void = () => () => {};

  try {
    // @ts-ignore - dynamic require for environment compatibility
    const reactRedux = require('react-redux');
    if (reactRedux) {
      useSelector = reactRedux.useSelector;
      useDispatch = reactRedux.useDispatch;
    }
  } catch (e) {
    // Fallback if react-redux is not available
  }

  const dispatch = useDispatch();

  // Select the authenticated user ID and the corresponding user object from state
  const authedUserId = useSelector((state: any) => state.authedUser);
  const user = useSelector((state: any) => {
    const users = state.users || {};
    return authedUserId ? (users[authedUserId] as User) : null;
  });

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch({ type: 'authedUser/logoutAuthedUser' });
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinkClass = (path: string) => `
    relative h-full flex items-center px-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
    ${isActive(path) ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between h-20 items-center">
          
          <div className="flex items-center space-x-12 h-full">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rotate-45 group-hover:rotate-0 transition-all duration-500 shadow-lg shadow-slate-200">
                <span className="text-white font-black text-sm -rotate-45 group-hover:rotate-0 transition-transform">W</span>
              </div>
              <span className="hidden sm:inline font-black text-xl tracking-tighter italic uppercase text-slate-900">
                Would<span className="text-indigo-600">You?</span>
              </span>
            </Link>

            <div className="hidden md:flex h-full items-center">
              <Link to="/" className={navLinkClass('/')}>
                Feed
                {isActive('/') && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>}
              </Link>
              <Link to="/add" className={navLinkClass('/add')}>
                Create
                {isActive('/add') && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>}
              </Link>
              <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>
                Rankings
                {isActive('/leaderboard') && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>}
              </Link>
            </div>
          </div>

          {user ? (
            <div className="flex items-center space-x-4 md:space-x-8">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active User</span>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{user.name}</span>
              </div>
              
              <div className="relative group flex items-center">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <img 
                  src={user.avatarURL} 
                  alt={user.name} 
                  className="relative h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm bg-slate-100"
                  onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`)}
                />
              </div>

              <button
                onClick={handleLogout}
                className="group flex items-center justify-center h-11 w-11 md:w-auto md:px-5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all duration-300 border border-slate-100 hover:border-red-100 shadow-sm"
              >
                <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest mr-2">Sign Out</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-100"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;