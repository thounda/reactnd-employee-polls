import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

/**
 * FILE: src/components/Nav.tsx
 * DESCRIPTION:
 * Premium Navigation bar featuring:
 * - Glassmorphism background effect.
 * - Active state indicators with bold underlines.
 * - User profile summary with quick-logout.
 * UPDATED: Optimized to use global Redux access to prevent build-time resolution errors.
 */

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Safely access Redux hooks from the global window object
  const useSelector = (window as any).ReactRedux?.useSelector || (() => null);
  const useDispatch = (window as any).ReactRedux?.useDispatch || (() => () => {});
  const dispatch = useDispatch();

  // Select the authenticated user ID and the corresponding user object from state
  const authedUserId = useSelector((state: any) => state.app?.authedUser || state.authedUser);
  const user = useSelector((state: any) => {
    const users = state.app?.users || state.users || {};
    return authedUserId ? users[authedUserId] : null;
  });

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Dispatch via string-based type to avoid direct slice import issues
    dispatch({ type: 'authedUser/logoutAuthedUser' });
    navigate('/login');
  };

  // Helper to determine if a link is active
  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) => `
    relative h-full flex items-center px-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
    ${isActive(path) ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between h-20 items-center">
          
          {/* Brand/Logo Area */}
          <div className="flex items-center space-x-12 h-full">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
                <span className="text-white font-black text-xs -rotate-45 group-hover:rotate-0 transition-transform">W</span>
              </div>
              <span className="font-black text-xl tracking-tighter italic uppercase text-slate-900">
                Would<span className="text-indigo-600">You?</span>
              </span>
            </Link>

            {/* Main Links */}
            <div className="hidden md:flex h-full items-center">
              <Link to="/" className={navLinkClass('/')}>
                Home
                {isActive('/') && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>}
              </Link>
              <Link to="/add" className={navLinkClass('/add')}>
                New Poll
                {isActive('/add') && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>}
              </Link>
              <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>
                Leaderboard
                {isActive('/leaderboard') && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>}
              </Link>
            </div>
          </div>

          {/* User Profile & Actions */}
          {user && (
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Logged in as</span>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{user.name}</span>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <img 
                  src={user.avatarURL} 
                  alt={user.name} 
                  className="relative h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
                  onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`)}
                />
              </div>

              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 px-4 py-2 rounded-xl transition-all duration-300 border border-slate-100 hover:border-red-100"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;