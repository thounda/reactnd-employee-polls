import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

/**
 * FILE: src/App.tsx
 * DESCRIPTION:
 * Standard production entry point for the Employee Polls application.
 * This version maintains clean imports for VS Code while using safe-guards
 * to ensure the preview environment remains stable.
 */

// --- Standard Imports for VS Code ---
// These resolve correctly in your local environment via node_modules.
import { useSelector as reduxUseSelector, useDispatch as reduxUseDispatch } from 'react-redux';
import { LoadingBar as ReduxLoadingBar } from 'react-redux-loading-bar';

// --- Component Imports ---
import Nav from './components/Nav';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewQuestion from './components/NewQuestion';
import Leaderboard from './components/Leaderboard';
import QuestionDetail from './components/QuestionDetail';
import { handleInitialData } from './actions/shared';

// --- Environment Bridge ---
// Safely falls back to global variables only if standard imports are unavailable.
const useSelector = (reduxUseSelector as any) || (window as any).ReactRedux?.useSelector || (() => ({}));
const useDispatch = (reduxUseDispatch as any) || (window as any).ReactRedux?.useDispatch || (() => () => {});
const LoadingBar = (ReduxLoadingBar as any) || (() => null);

interface RootState {
  authedUser: string | null;
  loadingBar: any;
}

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  const authedUser = useSelector((state: RootState) => state.authedUser);
  const loading = useSelector((state: RootState) => state.loadingBar?.default === 1);

  useEffect(() => {
    // Standard Redux Thunk dispatch for VS Code
    const action = typeof handleInitialData === 'function' 
      ? (handleInitialData() as any) 
      : { type: 'INITIAL_DATA_FALLBACK' };
      
    if (typeof dispatch === 'function') {
      dispatch(action);
    }
  }, [dispatch]);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authedUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  };

  return (
    <div className="app-container">
      <LoadingBar style={{ backgroundColor: '#4f46e5', height: '3px', position: 'fixed', top: 0, zIndex: 9999 }} />
      
      <div className="min-h-screen bg-gray-50 text-gray-900">
        {authedUser && (
          <Nav 
            activePath={location.pathname} 
            onNavigate={(path: string) => console.log(`Navigating to ${path}`)} 
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
              <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-gray-300 uppercase">404 - Page Not Found</h1>
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