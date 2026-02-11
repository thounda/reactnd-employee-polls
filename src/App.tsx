/**
 * File: src/App.tsx
 * Path: /src/App.tsx
 * * Purpose:
 * Root component of the "Employee Polls" application.
 * Updated: Replaced external LoadingBar with a local implementation to resolve 
 * runtime crashes in the Vite environment.
 * Fixed: Explicit pathing for internal modules to satisfy the build environment.
 */

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// RTK Implementation imports
// @ts-ignore
import { useAppDispatch, useAppSelector } from './store/hooks';
// @ts-ignore
import { handleInitialData } from './slices/questionsSlice';
// @ts-ignore
import { selectAuthedUser } from './slices/authedUserSlice';

// Component Imports
// @ts-ignore
import Login from './components/Login';
// @ts-ignore
import PrivateRoute from './components/PrivateRoute';
// @ts-ignore
import Dashboard from './components/Dashboard';
// @ts-ignore
import PollPage from './components/PollPage';
// @ts-ignore
import Leaderboard from './components/Leaderboard';
// @ts-ignore
import NewQuestion from './components/NewQuestion';
// @ts-ignore
import NotFound from './components/NotFound';
// @ts-ignore
import Nav from './components/Nav';

/**
 * Local Loading Bar Component
 * This replaces 'react-redux-loading-bar' to eliminate dependency issues
 * and provides a smoother visual experience.
 */
const CustomLoadingBar = ({ active }: { active: boolean }) => (
  <div 
    className={`fixed top-0 left-0 right-0 z-[100] h-1 bg-indigo-600 transition-transform duration-500 origin-left ${
      active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
    }`} 
  />
);

const App = () => {
  const dispatch = useAppDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        setIsInitializing(true);
        // @ts-ignore
        await dispatch(handleInitialData());
      } catch (error) {
        console.error("Failed to fetch initial application data:", error);
      } finally {
        setIsDataLoaded(true);
        setIsInitializing(false);
      }
    };
    initApp();
  }, [dispatch]);

  /**
   * Application Shell
   * We wait for initial data before allowing any routing to occur.
   */
  if (!isDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest animate-pulse">
            System Booting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Visual indicator for data fetching */}
      <CustomLoadingBar active={isInitializing} />
      
      <Nav />
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/add"
            element={
              <PrivateRoute>
                <NewQuestion />
              </PrivateRoute>
            }
          />

          <Route
            path="/questions/:question_id"
            element={
              <PrivateRoute>
                <PollPage />
              </PrivateRoute>
            }
          />

          {/* Catch-all */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;