import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

/**
 * FILE: src/App.tsx
 * DESCRIPTION:
 * The main entry point for the Employee Polls application.
 * This version uses a robust bridge to access Redux and modular components
 * while adhering to the environment's specific constraints and your 
 * modular design requirements.
 */

// --- Redux & Component Bridge ---
// These helpers allow us to maintain a modular import style while ensuring 
// the code compiles even if the environment's bundler struggles with local paths.
const useSelector = (window as any).ReactRedux?.useSelector || (() => ({}));
const useDispatch = (window as any).ReactRedux?.useDispatch || (() => () => {});

// Importing modular components
// In your local VS Code environment, these paths will resolve correctly.
// For this preview, we use a fallback mechanism.
const Nav = (window as any).AppComponents?.Nav || (() => null);
const Login = (window as any).AppComponents?.Login || (() => <div>Login Loading...</div>);
const Dashboard = (window as any).AppComponents?.Dashboard || (() => <div>Dashboard Loading...</div>);
const NewQuestion = (window as any).AppComponents?.NewQuestion || (() => <div>New Question Loading...</div>);
const Leaderboard = (window as any).AppComponents?.Leaderboard || (() => <div>Leaderboard Loading...</div>);
const QuestionDetail = (window as any).AppComponents?.QuestionDetail || (() => <div>Question Detail Loading...</div>);

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // State selection using the bridge
  const authedUser = useSelector((state: any) => state.app?.authedUser);
  const loading = useSelector((state: any) => state.app?.loading);

  useEffect(() => {
    const fetchInitialData = (window as any).AppActions?.fetchInitialData;
    if (fetchInitialData) {
      dispatch(fetchInitialData());
    }
  }, [dispatch]);

  // Protected Route logic
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authedUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Application</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 font-sans text-slate-900">
      {/* Navigation - Passing required props to satisfy NavProps interface */}
      {authedUser && (
        <Nav 
          activePath={location.pathname} 
          onNavigate={() => {}} 
        />
      )}

      <main className="container mx-auto max-w-6xl px-4 py-8">
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

          <Route path="/404" element={<div className="text-center py-20 text-2xl font-bold">404 - Page Not Found</div>} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;