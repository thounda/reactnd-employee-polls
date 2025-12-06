/**
 * File: src/App.js
 * Description: The root component of the application. Handles initial data loading,
 * Redux setup, and client-side routing, including authentication protection.
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { handleInitialData } from './actions/shared.js';

// Components
import Navigation from './components/Navigation.js';
import Login from './components/Login.js';
import RequireAuth from './components/RequireAuth.js';
// Placeholder components (will be created in upcoming steps)
import Dashboard from './components/Dashboard.js';
import NewPoll from './components/NewPoll.js';
import Leaderboard from './components/Leaderboard.js';
import PollDetail from './components/PollDetail.js';
import NotFound from './components/NotFound.js'; // 404 Page

function App() {
  const dispatch = useDispatch();

  // Check if both users and questions are loaded. We don't need to check authedUser here.
  const loading = useSelector(
    (state) => Object.keys(state.users).length === 0 || Object.keys(state.questions).length === 0
  );

  useEffect(() => {
    // Dispatch the thunk action to fetch initial data when the component first mounts
    dispatch(handleInitialData());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-2xl font-semibold text-indigo-600 animate-pulse p-8 rounded-lg shadow-xl bg-white">
          Loading Application Data...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation Bar is always present, regardless of auth status (it handles its own rendering) */}
        <Navigation />

        <main className="flex-grow p-4 md:p-8">
          <Routes>
            {/* 1. Public Route: Login */}
            <Route path="/login" element={<Login />} />

            {/* 2. Protected Routes Group */}
            {/* The RequireAuth component dictates if the user can view the nested routes (Outlet) */}
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<NewPoll />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              {/* Note: The 'question_id' parameter will be used to fetch the poll details */}
              <Route path="/questions/:question_id" element={<PollDetail />} />
            </Route>

            {/* 3. 404 Route - Catch all other unknown paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;