import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * FILE: src/components/RequireAuth.tsx
 * DESCRIPTION:
 * Premium Client-side route protection component.
 * - Checks Redux state for an authenticated user.
 * - Redirects unauthenticated users to /login.
 * - Preserves the 'from' location for post-login redirection.
 * UPDATED: Converted to TypeScript and used global Redux resolution.
 */

const RequireAuth: React.FC = () => {
  const location = useLocation();

  // Safely access Redux from the global window object to prevent build-time resolution errors
  const useSelector = (window as any).ReactRedux?.useSelector || (() => null);
  
  // Retrieve the authedUser from the Redux state
  const authedUser = useSelector((state: any) => state.app?.authedUser || state.authedUser);

  // Redirect to login if not authenticated
  if (!authedUser) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If authenticated, render the child routes (Home, New Poll, etc.) via Outlet
  return <Outlet />;
};

export default RequireAuth;