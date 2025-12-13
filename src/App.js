/**
 * File: src/App.js
 * Description: The root component of the application. Handles initial data loading,
 * Redux setup, and client-side routing, including authentication protection.
 */
import React from 'react';
// We only need Routes, Route, etc. because the Router context is already provided in main.js
import { Routes, Route } from 'react-router-dom';

// New: Import the custom hook to manage data loading
import usePollData from './hooks/usePollData.js'; 

// Components
import Navigation from './components/Navigation.js';
import Login from './components/Login.js';
import RequireAuth from './components/RequireAuth.js';
// Placeholder components
import Dashboard from './components/Dashboard.js';
import NewPoll from './components/NewPoll.js';
import Leaderboard from './components/Leaderboard.js';
import PollDetail from './components/PollDetail.js';
import NotFound from './components/NotFound.js'; // 404 Page

function App() {
  // Use the custom hook to handle data fetching and return the loading status
  const isLoading = usePollData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-2xl font-semibold text-indigo-600 animate-pulse p-8 rounded-lg shadow-xl bg-white">
          Loading Application Data...
        </div>
      </div>
    );
  }

  // NOTE: The <Router> component was removed as it is defined in src/main.js
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar is always present */}
      <Navigation />

      <main className="flex-grow p-4 md:p-8">
        <Routes>
          {/* 1. Public Route: Login */}
          <Route path="/login" element={<Login />} />

          {/* 2. Protected Routes Group */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<NewPoll />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/questions/:question_id" element={<PollDetail />} />
          </Route>

          {/* 3. 404 Route - Catch all other unknown paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;