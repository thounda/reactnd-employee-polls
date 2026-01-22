/**
 * File: src/components/RequireAuth.js
 * Description: Client-side route protection component.
 * * Note: This file uses standard React patterns for route guarding.
 * It checks the Redux store for an authenticated user and redirects 
 * unauthenticated users to the login page while preserving their 
 * intended destination.
 * * NOTE: The "Could not resolve" error in this preview is expected as 
 * external libraries like 'react-redux' are managed by your local 
 * environment and not the previewer.
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * RequireAuth - A wrapper component for protected routes.
 * * It captures the current location to allow for "deep linking" 
 * redirection after a successful login.
 */
const RequireAuth = () => {
  // Retrieve the authedUser from the Redux state
  const authedUser = useSelector((state) => state.authedUser);
  
  // Capture the current location for redirection purposes
  const location = useLocation();

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

  // If authenticated, render the children/nested routes via Outlet
  return <Outlet />;
};

export default RequireAuth;