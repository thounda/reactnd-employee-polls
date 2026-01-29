import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * FILE: src/components/RequireAuth.tsx
 * DESCRIPTION:
 * Premium Client-side route protection component.
 * - Checks Redux state for an authenticated user.
 * - Redirects unauthenticated users to /login.
 * - Preserves the 'from' location for post-login redirection.
 * FIX: Reverted to global Redux resolution to ensure compatibility with the build environment.
 */

const RequireAuth: React.FC = () => {
  const location = useLocation();
  
  // Safely access Redux hooks from the global window object to bypass resolution errors
  const useSelector = (window as any).ReactRedux?.useSelector || (() => undefined);
  
  // Retrieve the authedUser from the Redux state. 
  const authedUser = useSelector((state: any) => state.app?.authedUser ?? state.authedUser);

  // Handle the "Initialization" state.
  // If authedUser is undefined, the app might still be hydrating state.
  if (authedUser === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Verifying Identity</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (null or empty string)
  if (!authedUser) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If authenticated, render the child routes via Outlet
  return <Outlet />;
};

export default RequireAuth;