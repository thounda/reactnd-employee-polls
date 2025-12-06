/**
 * File: src/components/RequireAuth.js
 * Description: A wrapper component that protects routes, forcing unauthorized users
 * to the login page and saving their intended destination for redirection after login.
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * @description Renders the nested route children if the user is authenticated;
 * otherwise, redirects the user to the login page.
 * @returns {JSX.Element}
 */
function RequireAuth() {
  // Get the authenticated user ID from the Redux store
  const authedUser = useSelector((state) => state.authedUser);
  const location = useLocation();

  if (authedUser === null) {
    // If not authenticated, redirect them to the /login page.
    // The 'replace' prop ensures the login page replaces the failed page in history.
    // The 'state' prop saves the current location, allowing the Login component 
    // to redirect them back here after a successful login.
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the child routes (e.g., Dashboard, Leaderboard)
  return <Outlet />;
}

export default RequireAuth;