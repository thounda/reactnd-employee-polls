/**
 * File: src/App.js
 * Description: 
 * Main entry point for the Employee Polls application.
 * Handles initial data loading, routing, and authentication checks.
 */

import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleInitialData } from './actions/shared';
// We will build these components next:
// import Login from './components/Login';
// import Dashboard from './components/Dashboard';
// import Nav from './components/Nav';
// import Leaderboard from './components/Leaderboard';
// import NewPoll from './components/NewPoll';
// import PollPage from './components/PollPage';
// import NotFound from './components/NotFound';

/**
 * Note: Since we are in the process of building components, 
 * placeholders are used to prevent the app from breaking during development.
 */

const App = () => {
  const dispatch = useDispatch();
  
  // Extract authUser from the store to determine if we show Login or the App
  const authUser = useSelector((state) => state.authUser);

  useEffect(() => {
    // Fetch initial users and questions data on mount
    dispatch(handleInitialData());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="container">
        {!authUser ? (
          /* If not logged in, only show the Login view */
          <div className="login-container">
            <h2>Please sign in to continue</h2>
            {/* <Login /> */}
            <p style={{ textAlign: 'center' }}>[Login Component Placeholder]</p>
          </div>
        ) : (
          /* If logged in, show Navigation and the current Route */
          <Fragment>
            {/* <Nav /> */}
            <div className="main-content">
              {/* Logic for routing will go here. 
                  For now, we'll just show a welcome message. */}
              <h1>Welcome, {authUser}!</h1>
              <p>The Employee Polls Dashboard is loading...</p>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default App;