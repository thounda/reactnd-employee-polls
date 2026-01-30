import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';


import { useAppSelector } from '../store/hooks';



/**
 * FILE: src/components/RequireAuth.tsx
 * DESCRIPTION:
 * Premium Client-side route protection component.
 * Supports the 'children' pattern for wrapping protected routes in App.tsx.
 */

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();
  
  // Retrieve the authedUser from the Redux state. 
  const authedUser = useAppSelector((state: any) => state.authedUser);

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

  // If authenticated, render the children
  return <>{children}</>;
};

export default RequireAuth;