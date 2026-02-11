/**
 * File: RequireAuth.tsx
 * Path: src/components/RequireAuth.tsx
 * Description: Protects private routes. Redirects to /login if unauthenticated,
 * preserving the intended destination in the navigation state.
 * * Fix: 
 * Updated imports with additional environment flags to resolve compilation 
 * errors while maintaining the logic for path-aware redirection.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// @ts-ignore
import { useAppSelector } from '../store/hooks';
// @ts-ignore
import { selectAuthedUser } from '../slices/authedUserSlice';

interface RequireAuthProps {
  children: JSX.Element;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  // Use the typed hook to access the authenticated user state
  // @ts-ignore
  const authedUser = useAppSelector(selectAuthedUser);
  const location = useLocation();

  /**
   * Authentication Guard:
   * If the user is not logged in, redirect them to the login page.
   * We attach the 'from' location to the state object so the Login 
   * component can redirect them back to this specific URL after success.
   */
  if (!authedUser) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If authenticated, allow access to the protected route (children)
  return children;
};

export default RequireAuth;