/**
 * @file src/App.tsx
 * @description
 * Primary component for the Employee Polls application.
 * Responsibilities:
 * 1. Fetches initial data (users and questions) on mount.
 * 2. Manages high-level routing using React Router.
 * 3. Implements route guarding via the RequireAuth component.
 * 4. Conditionally renders the Navigation bar based on auth state.
 */

import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './store/hooks';
import { handleInitialData } from './slices/questionsSlice';
import { RootState } from './store/store';
import Nav from './components/Nav';
import Dashboard from './components/Dashboard';
import NewQuestion from './components/NewQuestion';
import Leaderboard from './components/Leaderboard';
import QuestionPage from './components/QuestionPage';
import Login from './components/Login';
import RequireAuth from './components/RequireAuth';
import NotFound from './components/NotFound';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Using RootState for better type inference
  const authedUser = useAppSelector((state: RootState) => state.authedUser);

  useEffect(() => {
    // Loads initial users and questions into the Redux store
    dispatch(handleInitialData());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navigation only appears if the user is logged in */}
      {authedUser && <Nav />}
      
      <main className="container mx-auto px-4 py-6">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes - Wrapped in RequireAuth */}
          <Route 
            path="/" 
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } 
          />
          
          <Route 
            path="/add" 
            element={
              <RequireAuth>
                <NewQuestion />
              </RequireAuth>
            } 
          />
          
          <Route 
            path="/leaderboard" 
            element={
              <RequireAuth>
                <Leaderboard />
              </RequireAuth>
            } 
          />
          
          <Route 
            path="/questions/:question_id" 
            element={
              <RequireAuth>
                <QuestionPage />
              </RequireAuth>
            } 
          />

          {/* Fallback Routes for 404 handling */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;