/**
 * Employee Polls - Main Application
 * FILE: src/APP.js
 * 
 * * Purpose: A "Would You Rather" style social polling application where users
 * can create polls, vote on existing ones, and compete on a leaderboard.
 
* * Logic Overview:
 * - State Management: Uses React hooks for local data, authentication, and routing.
 * - Routing: Implements a custom view-switching logic (Dashboard, Leaderboard, New, Detail).
 * - Persistence: Includes a mock data block for immediate preview. 
 * - External Data: Toggle the import in the "EXTERNAL DATA" section to use _DATA.js.
 */

import React, { useState, useEffect } from 'react';

// --- REQUIRED IMPORT FOR VSCODE (Uncomment when moving to local environment) ---
import { _getUsers, _getQuestions, _saveQuestion, _saveQuestionAnswer } from './utils/_DATA.js';

const Navbar = ({ authedUser, users, setView, onLogout, view }) => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-4 flex justify-between h-16 items-center">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="font-bold text-lg tracking-tight text-gray-900">POLLS</span>
        </div>
        <div className="flex space-x-1">
          {['dashboard', 'leaderboard', 'new'].map(nav => (
            <button 
              key={nav}
              onClick={() => setView(nav)}
              className={`px-3 py-2 rounded-md text-xs font-bold transition-colors ${
                view === nav ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              {nav.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src={users[authedUser]?.avatarURL} alt="" className="w-6 h-6 rounded-full" />
          <span className="text-xs font-medium text-gray-600">{users[authedUser]?.name}</span>
        </div>
        <button onClick={onLogout} className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase">Logout</button>
      </div>
    </div>
  </nav>
);

const QuestionCard = ({ question, author, isDone, onSelect }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-3 mb-4">
      <img src={author?.avatarURL} className="w-10 h-10 rounded-full" alt="" />
      <div>
        <p className="text-sm font-bold text-gray-900">{author?.name}</p>
        <p className="text-[10px] text-gray-400 font-medium uppercase">{new Date(question.timestamp).toLocaleDateString()}</p>
      </div>
    </div>
    <p className="text-gray-800 font-semibold mb-4 italic line-clamp-1">"{question.optionOne.text}..."</p>
    <button 
      onClick={() => onSelect(question.id)}
      className={`w-full py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white transition-colors ${
        isDone ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
      }`}
    >
      {isDone ? 'Results' : 'View Poll'}
    </button>
  </div>
);

const QuestionDetail = ({ question, author, authedUser, onBack, onVote }) => {
  if (!question) return null;
  const answered = question.optionOne.votes.includes(authedUser) || question.optionTwo.votes.includes(authedUser);
  const totalVotes = question.optionOne.votes.length + question.optionTwo.votes.length;
  
  const Option = ({ option, isOne }) => {
    const isVoted = option.votes.includes(authedUser);
    const percent = totalVotes === 0 ? 0 : Math.round((option.votes.length / totalVotes) * 100);
    const colorClass = isOne ? 'indigo' : 'emerald';
    
    // Explicit Tailwind classes to ensure compiler picks them up
    const borderClass = isVoted 
        ? (isOne ? 'border-indigo-500 bg-indigo-50' : 'border-emerald-500 bg-emerald-50') 
        : 'border-gray-100';
    const barColor = isOne ? 'bg-indigo-500' : 'bg-emerald-500';
    const btnColor = isOne ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700';

    return (
      <div className={`p-4 rounded-xl border-2 transition-all ${borderClass}`}>
        <p className="font-bold text-gray-800 mb-2">{option.text}</p>
        {answered ? (
          <div className="space-y-1">
            <div className="h-2 bg-gray-200 rounded-full">
              <div className={`h-full ${barColor} rounded-full`} style={{width: `${percent}%`}}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-500">
              <span>{option.votes.length} Votes</span>
              <span>{percent}%</span>
            </div>
            {isVoted && <span className="text-[10px] font-black text-indigo-600 uppercase">Your Choice</span>}
          </div>
        ) : (
          <button 
            onClick={() => onVote(question.id, isOne ? 'optionOne' : 'optionTwo')} 
            className={`w-full py-2.5 mt-2 ${btnColor} text-white rounded-lg text-xs font-black uppercase tracking-widest transition-colors`}
          >
            Vote
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto">
      <button onClick={onBack} className="text-xs font-bold text-gray-400 mb-6 flex items-center hover:text-indigo-600">← BACK</button>
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="bg-gray-50 p-6 text-center border-b">
          <img src={author?.avatarURL} className="w-16 h-16 rounded-full mx-auto mb-2 shadow-sm" alt="" />
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Poll by {author?.name}</h2>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Would You Rather...</h3>
        </div>
        <div className="p-6 space-y-4">
          <Option option={question.optionOne} isOne={true} />
          <Option option={question.optionTwo} isOne={false} />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [authedUser, setAuthedUser] = useState(null);
  const [data, setData] = useState({ users: {}, questions: {} });
  const [view, setView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginVal, setLoginVal] = useState("");
  const [newOpt1, setNewOpt1] = useState("");
  const [newOpt2, setNewOpt2] = useState("");

  useEffect(() => {
    Promise.all([_getUsers(), _getQuestions()]).then(([u, q]) => {
      setData({ users: u, questions: q });
      setLoading(false);
    });
  }, []);

  const handleVote = async (qid, answer) => {
    await _saveQuestionAnswer({ authedUser, qid, answer });
    const [u, q] = await Promise.all([_getUsers(), _getQuestions()]);
    setData({ users: u, questions: q });
  };

  const handleCreate = async () => {
    await _saveQuestion({ optionOneText: newOpt1, optionTwoText: newOpt2, author: authedUser });
    const [u, q] = await Promise.all([_getUsers(), _getQuestions()]);
    setData({ users: u, questions: q });
    setNewOpt1(""); setNewOpt2("");
    setView('dashboard');
  };

  if (loading) return null;

  if (!authedUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-lg shadow-indigo-200">P</div>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase">Employee Polls</h1>
            <p className="text-gray-400 text-sm font-bold mt-1 uppercase tracking-widest">Sign in to continue</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Select Employee</label>
              <select 
                value={loginVal} 
                onChange={e => setLoginVal(e.target.value)} 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-gray-700"
              >
                <option value="">Choose your identity...</option>
                {Object.values(data.users).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <button 
              onClick={() => loginVal && setAuthedUser(loginVal)} 
              disabled={!loginVal}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              Enter Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const qList = Object.values(data.questions).sort((a,b) => b.timestamp - a.timestamp);
  const answered = qList.filter(q => q.optionOne.votes.concat(q.optionTwo.votes).includes(authedUser));
  const unanswered = qList.filter(q => !answered.includes(q));

  const getRankStyles = (index) => {
    switch(index) {
      case 0: return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case 1: return "bg-orange-100 text-orange-700 border-orange-200";
      case 2: return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-indigo-100 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar authedUser={authedUser} users={data.users} setView={setView} onLogout={() => setAuthedUser(null)} view={view} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'dashboard' && (
          <div className="grid md:grid-cols-2 gap-12">
            <section>
              <h2 className="text-lg font-black mb-6 flex items-center justify-between">UNANSWERED <span className="bg-indigo-100 text-indigo-700 text-xs px-2 rounded-full">{unanswered.length}</span></h2>
              <div className="space-y-4">
                {unanswered.map(q => <QuestionCard key={q.id} question={q} author={data.users[q.author]} onSelect={id => { setSelectedId(id); setView('detail'); }} />)}
              </div>
            </section>
            <section>
              <h2 className="text-lg font-black mb-6 flex items-center justify-between text-gray-400">ANSWERED <span className="bg-gray-200 text-gray-500 text-xs px-2 rounded-full">{answered.length}</span></h2>
              <div className="space-y-4 opacity-75">
                {answered.map(q => <QuestionCard key={q.id} question={q} author={data.users[q.author]} isDone onSelect={id => { setSelectedId(id); setView('detail'); }} />)}
              </div>
            </section>
          </div>
        )}
        {view === 'detail' && (
          <QuestionDetail question={data.questions[selectedId]} author={data.users[data.questions[selectedId].author]} authedUser={authedUser} onBack={() => setView('dashboard')} onVote={handleVote} />
        )}
        {view === 'new' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border">
            <h2 className="text-xl font-black mb-6 text-center">CREATE NEW POLL</h2>
            <div className="space-y-4">
              <input value={newOpt1} onChange={e => setNewOpt1(e.target.value)} placeholder="Option One" className="w-full p-3 border rounded-xl" />
              <input value={newOpt2} onChange={e => setNewOpt2(e.target.value)} placeholder="Option Two" className="w-full p-3 border rounded-xl" />
              <button onClick={handleCreate} disabled={!newOpt1 || !newOpt2} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:bg-gray-300">Submit</button>
            </div>
          </div>
        )}
        {view === 'leaderboard' && (
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-tighter">Leaderboard</h2>
            {Object.values(data.users).sort((a,b) => (Object.keys(b.answers).length + b.questions.length) - (Object.keys(a.answers).length + a.questions.length)).map((u, i) => {
              const rankClass = getRankStyles(i);
              return (
                <div key={u.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 font-black flex items-center justify-center mr-6 rounded-xl border-2 text-sm ${rankClass}`}>
                    #{i+1}
                  </div>
                  <img src={u.avatarURL} className="w-12 h-12 rounded-full mr-5 shadow-inner" alt="" />
                  <div className="flex-1">
                    <p className="font-black text-gray-900">{u.name}</p>
                    <div className="flex space-x-4 mt-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Polls: {u.questions.length}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Answers: {Object.keys(u.answers).length}</p>
                    </div>
                  </div>
                  <div className="text-right pl-6 border-l border-gray-50">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Score</p>
                    <div className={`text-2xl font-black px-4 py-1 rounded-lg ${rankClass.split(' ').slice(0, 2).join(' ')}`}>
                      {u.questions.length + Object.keys(u.answers).length}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}