/**
 * File: src/App.js
 * Description: The root component of the application. Handles initial data loading,
 * Redux setup, and client-side routing, including authentication protection.
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import the custom hook to manage data loading
import usePollData from './hooks/usePollData.js'; 

// Components
import NavBar from './components/NavBar.js';
import Login from './components/Login.js';
import RequireAuth from './components/RequireAuth.js';
import Dashboard from './components/Dashboard.js';
import NewPoll from './components/NewPoll.js';
import Leaderboard from './components/Leaderboard.js';
import QuestionPage from './components/QuestionPage.js'; // <-- FIXED: Changed from PollDetail
import NotFound from './components/NotFound.js';

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar /> 

      <main className="flex-grow p-4 md:p-8">
        <Routes>
          {/* 1. Public Route: Login */}
          <Route path="/login" element={<Login />} />

          {/* 2. Protected Routes Group */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<NewPoll />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            {/* FIXED: 
              1. Parameter name changed to :qid to match useParams() in QuestionPage.js
              2. Component changed to QuestionPage
            */}
            <Route path="/questions/:qid" element={<QuestionPage />} />
          </Route>

          {/* 3. 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;