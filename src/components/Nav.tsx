import React from 'react';

/**
 * FILE: src/components/Nav.tsx
 * DESCRIPTION: 
 * Top navigation bar for the Employee Polls application.
 * Integrated with global Redux state for user display and logout.
 * FIX: Replaced library imports with window-level resolution to bypass environment issues.
 */

// Inline SVG Icons for zero-dependency reliability
const Icons = {
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  PlusSquare: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
  ),
  Trophy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55-.47.98-.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  ),
  LogOut: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  )
};

interface NavProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

const Nav: React.FC<NavProps> = ({ activePath, onNavigate }) => {
  // Safe resolution of hooks and actions
  const useSelector = (window as any).ReactRedux?.useSelector || (() => ({}));
  const useDispatch = (window as any).ReactRedux?.useDispatch || (() => () => {});
  const logout = (window as any).AppActions?.logout; // Assumed exposure in store.tsx

  const dispatch = useDispatch();
  
  // Access state with flexible typing
  const authedUserId = useSelector((state: any) => state.app?.authedUser);
  const users = useSelector((state: any) => state.app?.users || {});
  
  const authedUser = authedUserId ? users[authedUserId] : null;

  const handleLogout = () => {
    if (logout) {
      dispatch(logout());
    } else {
      // Fallback if action is not exposed globally yet
      dispatch({ type: 'app/logout' });
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: <Icons.Home /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Icons.Trophy /> },
    { id: 'add', label: 'New Poll', icon: <Icons.PlusSquare /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2">
            <div className="mr-8 flex items-center space-x-3 group cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
                <span className="font-black text-xl italic">P</span>
              </div>
              <span className="hidden lg:block font-black text-slate-900 tracking-tighter uppercase text-lg">
                Polls<span className="text-indigo-600">Hub</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                    activePath === item.id
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {authedUser && (
            <div className="flex items-center space-x-6 border-l border-slate-100 pl-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
                  {authedUser.name}
                </span>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest opacity-80">
                  {authedUser.id}
                </span>
              </div>
              
              <div className="relative">
                <img
                  src={authedUser.avatarURL}
                  alt={authedUser.name}
                  className="w-11 h-11 rounded-2xl border-2 border-white shadow-md bg-slate-100 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authedUser.name)}&background=6366f1&color=fff`;
                  }}
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                title="Sign Out"
              >
                <div className="group-hover:translate-x-0.5 transition-transform">
                  <Icons.LogOut />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;