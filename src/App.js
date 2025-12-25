/**
 * File: src/App.js
 * Description: Main entry point for the "Would You Rather" Application.
 * Re-integrating the Leaderboard component into the functional architecture.
 * * NOTE: The "Could not resolve" errors in this preview panel are expected.
 * This environment cannot access your local project's 'react-redux' library
 * or your custom components/actions folders.
 */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { handleInitialData } from './actions/shared';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Nav from './components/Nav';
import Leaderboard from './components/Leaderboard';

/**
 * App Component
 * Handles conditional rendering for Dashboard and Leaderboard using functional hooks.
 */
const App = () => {
  const dispatch = useDispatch();
  
  // Local state to toggle between Dashboard and Leaderboard views 
  // until a proper Router is implemented in future steps.
  const [view, setView] = useState('dashboard');
  
  const authedUser = useSelector((state) => state.authedUser);
  const loading = useSelector((state) => Object.keys(state.users || {}).length === 0);

  useEffect(() => {
    // Fetch initial data on mount
    dispatch(handleInitialData());
  }, [dispatch]);

  return (
    <div className="container mx-auto min-h-screen bg-slate-50">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold text-gray-700">Loading data...</p>
        </div>
      ) : (
        <div className="app-content min-h-screen">
          {authedUser === null ? (
            <Login />
          ) : (
            <>
              {/* Pass setView to Nav so it can change the view state */}
              <Nav setView={setView} />
              <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Conditional rendering based on the navigation state */}
                {view === 'dashboard' && <Dashboard />}
                {view === 'leaderboard' && <Leaderboard />}
                {/* Future view for New Poll can be added here */}
              </main>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;