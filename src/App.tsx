import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Vote, 
  PlusCircle, 
  Settings, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Users,
  ChevronRight
} from 'lucide-react';

/**
 * File: src/App.tsx
 * Purpose: Main Polls Application Component
 * Description: 
 * Manages the state and UI for creating and participating in user polls.
 * Strictly uses TypeScript (.tsx) as per project requirements.
 */

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  isActive: boolean;
}

const App: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        // Simulating an initial fetch of active polls
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockPolls: Poll[] = [
          {
            id: '1',
            question: "What should be our primary focus for Q3?",
            totalVotes: 154,
            isActive: true,
            options: [
              { id: 'a', text: "Performance Optimization", votes: 45 },
              { id: 'b', text: "New Feature Requests", votes: 82 },
              { id: 'c', text: "Technical Debt", votes: 27 }
            ]
          }
        ];
        
        setPolls(mockPolls);
        setStatus('ready');
      } catch (err) {
        setError("Failed to load active polls.");
        setStatus('error');
      }
    };

    fetchPolls();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-600 font-medium">Loading Polling Data...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full border border-red-100 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900">Connection Error</h2>
          <p className="text-slate-600 my-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Vote className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">PollMaster</h1>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Feedback System</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            LIVE
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Header Section */}
      <header className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Active Polls</h2>
            <p className="text-slate-500 mt-1 italic">Real-time feedback from your community members.</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-md shadow-indigo-100">
            <PlusCircle className="w-4 h-4" />
            Create New Poll
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Poll Card */}
        <div className="lg:col-span-2 space-y-6">
          {polls.map(poll => (
            <div key={poll.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-indigo-200 transition-colors">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-indigo-600 mb-3">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Trending Now</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-6 leading-tight">
                  {poll.question}
                </h3>
                
                <div className="space-y-4">
                  {poll.options.map(option => {
                    const percentage = Math.round((option.votes / poll.totalVotes) * 100);
                    return (
                      <div key={option.id} className="group relative">
                        <div className="flex justify-between items-center mb-1 text-sm font-bold">
                          <span className="text-slate-700">{option.text}</span>
                          <span className="text-indigo-600">{percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full transition-all duration-1000 group-hover:bg-indigo-400" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-slate-500 text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {poll.totalVotes} responses
                  </span>
                </div>
                <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  View Insights <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Statistics */}
        <aside className="space-y-6">
          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
            <h4 className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-black">2.4k</div>
                <div className="text-indigo-300 text-xs">Total Participations</div>
              </div>
              <div className="pt-4 border-t border-indigo-800">
                <div className="text-2xl font-black">12</div>
                <div className="text-indigo-300 text-xs">Polls Completed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Upcoming Schedule</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5" />
                <span className="text-sm font-medium text-slate-600">Product Branding Poll (Monday)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5" />
                <span className="text-sm font-medium text-slate-600">User Experience Survey</span>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;