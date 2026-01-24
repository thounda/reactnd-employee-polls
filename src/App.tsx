import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

/**
 * FILE: src/App.tsx
 * DESCRIPTION:
 * Main entry point for the Employee Polls application.
 * This version uses robust bridging to ensure the preview environment
 * remains stable despite local file dependencies.
 */

// --- Standard Imports for VS Code ---
// These resolve correctly in your local environment.
import { useSelector as reduxUseSelector, useDispatch as reduxUseDispatch } from 'react-redux';
import ReduxLoadingBar from 'react-redux-loading-bar';

// --- Component Imports ---
import Nav from './components/Nav';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewQuestion from './components/NewQuestion';
import Leaderboard from './components/Leaderboard';
import QuestionDetail from './components/QuestionDetail';
import { handleInitialData } from './actions/shared';

// --- Environment Bridge ---
// Safely falls back to globals if standard imports are unavailable in the preview.
const useSelector = (reduxUseSelector as any) || (window as any).ReactRedux?.useSelector || (() => ({}));
const useDispatch = (reduxUseDispatch as any) || (window as any).ReactRedux?.useDispatch || (() => () => {});
const LoadingBar = (ReduxLoadingBar as any) || (window as any).ReactReduxLoadingBar?.default || (() => null);

interface RootState {
  authedUser: string | null;
  loadingBar: any;
}

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const authedUser = useSelector((state: RootState) => state.authedUser);

  useEffect(() => {
    // Standard Thunk dispatch
    if (typeof handleInitialData === 'function' && typeof dispatch === 'function') {
      dispatch(handleInitialData());
    }
  }, [dispatch]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authedUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  };

  return (
    <div className="app-container">
      <LoadingBar 
        style={{ 
          backgroundColor: '#4f46e5', 
          height: '3px', 
          position: 'fixed', 
          top: 0, 
          zIndex: 9999 
        }} 
      />
      
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {authedUser && (
          <Nav 
            activePath={location.pathname}
            onNavigate={handleNavigation}
          />
        )}

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <Routes>
            <Route 
              path="/login" 
              element={authedUser ? <Navigate to="/" /> : <Login />} 
            />

            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/add" 
              element={
                <ProtectedRoute>
                  <NewQuestion />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/questions/:question_id" 
              element={
                <ProtectedRoute>
                  <QuestionDetail />
                </ProtectedRoute>
              } 
            />

            <Route path="/404" element={
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
                <p className="text-xl text-gray-500 mt-4">Oops! The poll you are looking for doesn't exist.</p>
              </div>
            } />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;