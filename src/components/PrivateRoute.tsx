/**
 * File: PrivateRoute.tsx
 * Path: src/components/PrivateRoute.tsx
 * * Description:
 * A Higher-Order Component (HOC) designed to protect application routes. 
 * This component interfaces with the Redux store to verify the user's 
 * authentication status. If the user is not authenticated, it redirects 
 * them to the login page while preserving their attempted destination 
 * in the navigation state, allowing for a seamless return after login.
 * * Logic:
 * 1. Accesses 'authedUser' via the custom 'useAppSelector' hook.
 * 2. Validates 'authedUser' existence (works with string IDs or user objects).
 * 3. Uses React Router's 'Navigate' for redirection or renders children if authorized.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Using internal hooks to ensure compatibility with the build environment
// @ts-ignore
import { useAppSelector } from '../store/hooks';
// @ts-ignore
import { selectAuthedUser } from '../slices/authedUserSlice';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  /**
   * We wrap the selector call to handle the environment's path resolution.
   * In your local VS Code environment, this will point to your Redux state.
   */
  // @ts-ignore
  const authedUser = useAppSelector(selectAuthedUser);
  const location = useLocation();

  /**
   * Robust check for authentication status:
   * 1. Check if authedUser exists.
   * 2. If it's a string, ensure it has length.
   * 3. If it's an object, ensure it's not empty.
   */
  const isAuthenticated = !!(
    authedUser && 
    (typeof authedUser === 'string' ? authedUser.length > 0 : Object.keys(authedUser).length > 0)
  );

  if (!isAuthenticated) {
    /**
     * Redirect to Login:
     * We pass the current 'location' in the navigation state.
     * This allows the Login component to perform a "deep link" redirect
     * back to the specific poll or page the user was trying to access.
     */
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component (children)
  return <>{children}</>;
};

export default PrivateRoute;