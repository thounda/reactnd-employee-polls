import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from './store/hooks';
import { handleInitialData } from './slices/questionsSlice';
import Nav from './components/Nav';
import Dashboard from './components/Dashboard';
import NewQuestion from './components/NewQuestion';
import Leaderboard from './components/Leaderboard';
import QuestionPage from './components/QuestionPage';
import Login from './components/Login';
import RequireAuth from './components/RequireAuth';
import NotFound from './components/NotFound';

/**
 * Note on Error 2559: 
 * This usually happens if RequireAuth is defined as a functional component 
 * without explicitly typing the 'children' prop in its own file.
 * Ensure your src/components/RequireAuth.tsx defines props like:
 * interface RequireAuthProps { children: React.ReactNode; }
 */

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const authedUser = useAppSelector((state: any) => state.authedUser);

  useEffect(() => {
    dispatch(handleInitialData());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      {authedUser && <Nav />}
      
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          
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

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;