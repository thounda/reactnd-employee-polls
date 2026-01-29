import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * FILE: src/components/Login.tsx
 * DESCRIPTION: 
 * A high-impact, modern login screen. Features a clean user 
 * selection interface with hover states and automatic redirection.
 */

// Import the action from the authedUser slice
import { setAuthedUser } from '../slices/authedUserSlice';

const Login: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Using standard Redux hooks with local type casting for the preview environment
  const { users, authedUser } = useSelector((state: any) => ({
    users: state.users || {},
    authedUser: state.authedUser
  }));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (authedUser) {
      const { from } = location.state || { from: { pathname: '/' } };
      navigate(from, { replace: true });
    }
  }, [authedUser, navigate, location]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    setIsLoading(true);
    // Simulate a brief loading state for a polished "premium" feel
    setTimeout(() => {
      dispatch(setAuthedUser(selectedUserId) as any);
      // Redirection is handled by the useEffect above once state updates
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Branding Area */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 rotate-12 transition-transform hover:rotate-0 duration-500">
            <span className="text-white text-4xl font-black -rotate-12 italic hover:rotate-0 transition-transform duration-500">W</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            Would You <span className="text-indigo-600">Rather?</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Please sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 p-10 md:p-12 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center px-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Authenticating Session...</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">
                Select Your Identity
              </label>
              
              <div className="grid grid-cols-1 gap-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.values(users).map((user: any) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 group ${
                      selectedUserId === user.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100'
                        : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'
                    }`}
                  >
                    <img 
                      src={user.avatarURL} 
                      alt={user.name} 
                      className="w-12 h-12 rounded-xl bg-white shadow-sm object-cover transition-transform group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;
                      }}
                    />
                    <div className="text-left">
                      <p className={`font-black text-sm transition-colors ${selectedUserId === user.id ? 'text-indigo-600' : 'text-slate-900'}`}>
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">@{user.id}</p>
                    </div>
                    {selectedUserId === user.id && (
                      <div className="ml-auto w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedUserId || isLoading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                selectedUserId && !isLoading
                  ? 'bg-slate-900 text-white hover:bg-black hover:shadow-indigo-200'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Sign In
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Build v1.0.5 • Standard Security
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default Login;