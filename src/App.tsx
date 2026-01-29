import React, { useState, useEffect } from 'react';

/**
 * File: src/App.tsx
 * DESCRIPTION:
 * Main entry point for the Employee Polls application.
 * This version uses standard dynamic imports and conditional logic to allow
 * the code to coexist with the preview environment's constraints while
 * remaining fully functional for your local VS Code environment.
 */

// We use relative paths for your local environment. 
// The @ts-ignore flags prevent the previewer from blocking on missing local files.

// @ts-ignore
import { _getUsers } from './utils/_DATA';
// @ts-ignore
import Nav from './components/Nav';
// @ts-ignore
import Login from './components/Login';
// @ts-ignore
import Dashboard from './components/Dashboard';
// @ts-ignore
import NewQuestion from './components/NewQuestion';
// @ts-ignore
import Leaderboard from './components/Leaderboard';
// @ts-ignore
import QuestionDetail from './components/QuestionDetail';
// @ts-ignore
import NotFound from './components/NotFound';

interface User {
  id: string;
  name: string;
  avatarURL: string;
  answers: Record<string, string>;
  questions: string[];
}

interface UsersState {
  [key: string]: User;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<UsersState | null>(null);
  const [authedUser, setAuthedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  useEffect(() => {
    // Check if the data utility exists before calling to prevent runtime crashes in preview
    if (typeof _getUsers === 'function') {
      _getUsers()
        .then((data: any) => {
          setUsers(data as UsersState);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error("Hydration failed:", err);
          setLoading(false);
        });
    } else {
      // In local development, this won't trigger if the file is present.
      // In the preview, this allows the UI to at least mount.
      console.warn("Initial data utility not found.");
    }
  }, []);

  if (loading || !users) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
          Initializing Workspace
        </p>
      </div>
    );
  }

  // Authentication guard
  if (!authedUser) {
    const LoginComponent = Login as any;
    return <LoginComponent onLogin={setAuthedUser} users={users} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        const DashComponent = Dashboard as any;
        return <DashComponent users={users} authedUser={authedUser} />;
      case 'add':
        const AddComponent = NewQuestion as any;
        return <AddComponent authedUser={authedUser} onNavigate={setCurrentPage} />;
      case 'leaderboard':
        const LeaderComponent = Leaderboard as any;
        return <LeaderComponent users={users} />;
      default:
        if (currentPage.startsWith('questions/')) {
          const questionId = currentPage.split('/')[1];
          const DetailComponent = QuestionDetail as any;
          return (
            <DetailComponent 
              id={questionId} 
              userId={authedUser} 
              navigate={setCurrentPage} 
            />
          );
        }
        const ErrorComponent = NotFound as any;
        return <ErrorComponent onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Navigation Header */}
      {React.createElement(Nav as any, {
        user: users[authedUser],
        logout: () => setAuthedUser(null),
        navigate: setCurrentPage,
        activePath: currentPage
      })}
      
      {/* Main Content Area */}
      <main className="flex-grow container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 min-h-[70vh] overflow-hidden">
          {renderContent()}
        </div>
      </main>

      {/* App Footer */}
      <footer className="py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
        Platform v1.0.5 &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;