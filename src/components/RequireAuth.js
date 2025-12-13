/**
 * File: src/components/RequireAuth.js
 * Description: A component used for client-side routing protection.
 * If a user is not authenticated, they are redirected to the /login page,
 * with the intended destination saved in the router state.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * @description Protects child routes, redirecting unauthenticated users to the login page.
 * @returns {React.ReactNode} The Outlet (nested routes) if authenticated, or a Navigate component.
 */
function RequireAuth() {
  // Get the authenticated user ID from the Redux store
  const authedUser = useSelector((state) => state.authedUser);
  
  // Get the current location object to pass the intended path to the login screen
  const location = useLocation();

  if (!authedUser) {
    // Redirect to the login page, passing the current path in the state
    return <Navigate to="/login" state={{ path: location.pathname }} replace />;
  }

  // If authenticated, render the child routes (Dashboard, NewPoll, etc.)
  return <Outlet />;
}

export default RequireAuth;