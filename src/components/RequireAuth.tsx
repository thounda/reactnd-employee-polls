import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store/store';

/**
 * FILE: src/components/RequireAuth.tsx
 * DESCRIPTION:
 * This is your "Gatekeeper" component. It ensures that only logged-in users
 * can see specific pages (Dashboard, New Poll, etc.).
 */

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();
  const authedUser = useAppSelector((state: RootState) => state.authedUser);

  // 1. LOADING STATE: 
  // If authedUser is undefined, it means we haven't finished checking 
  // the 'mock database' yet. Show a spinner so we don't redirect prematurely.
  if (authedUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Verifying Identity
          </p>
        </div>
      </div>
    );
  }

  // 2. UNAUTHORIZED STATE:
  // If authedUser is null (or empty), redirect to Login.
  // We pass 'location' into the 'state' prop so that after the user logs in,
  // we can send them back to where they were (e.g., a specific poll URL).
  if (!authedUser) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // 3. AUTHORIZED STATE:
  // User is logged in, show them the requested page!
  return <>{children}</>;
};

export default RequireAuth;