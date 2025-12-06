import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { handleInitialData } from './actions/shared.js'; // Requires actions/shared.js

// Component Imports (Placeholders we will create next)
import Login from './components/Login.js';
import Nav from './components/Nav.js';
import Dashboard from './components/Dashboard.js'; 
import NewPoll from './components/NewPoll.js'; 
import PollDetail from './components/PollDetail.js';
import Error404 from './components/Error404.js'; 

// ---------------------------------------------------------------------------
// Private Route Component (Wrapper for protected routes)
// ---------------------------------------------------------------------------
/**
 * @description A wrapper component that checks for authentication.
 * If the user is authenticated, it renders the child element.
 * Otherwise, it redirects the user to the Login page.
 */
const PrivateRoute = ({ children }) => {
  // We use the Redux state to determine if a user is logged in
  const authedUser = useSelector((state) => state.authedUser);
  return authedUser ? children : <Navigate to="/login" replace />;
};

// ---------------------------------------------------------------------------
// Main App Component
// ---------------------------------------------------------------------------
function App() {
  const dispatch = useDispatch();
  const authedUser = useSelector((state) => state.authedUser);
  const usersLoaded = useSelector((state) => Object.keys(state.users).length > 0);

  // Load initial data (users and questions) when the app mounts
  useEffect(() => {
    // Only fetch data if users haven't been loaded yet
    if (!usersLoaded) {
      dispatch(handleInitialData());
    }
  }, [dispatch, usersLoaded]);

  // Display a loading screen while initial data is being fetched
  if (!usersLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-indigo-600 animate-pulse">Loading Application Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navigation is only rendered if the user is authenticated */}
      {authedUser && <Nav />}

      <main className="flex-grow p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes: Require authentication via PrivateRoute */}
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/add" element={<PrivateRoute><NewPoll /></PrivateRoute>} />
            <Route path="/leaderboard" element={<PrivateRoute><div className="text-center p-10 bg-white rounded-xl shadow-lg">Leaderboard Component Coming Soon!</div></PrivateRoute>} />
            <Route path="/questions/:id" element={<PrivateRoute><PollDetail /></PrivateRoute>} />
            
            {/* Catch-all 404 Route */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </div>
      </main>
      
      <footer className="w-full bg-white p-4 text-center text-sm text-gray-500 border-t border-gray-200 mt-auto">
        Employee Polls App &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;