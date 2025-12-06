/**
 * File: src/components/Dashboard.js
 * Description: The main application dashboard (Home page).
 * This component will display two lists: unanswered polls and answered polls.
 */
import React from 'react';

function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Home Dashboard</h2>
      <div className="p-6 border border-gray-200 rounded-lg bg-indigo-50 text-indigo-700">
        <p className="font-semibold">Placeholder Content</p>
        <p>This is where the user will see tabs for UNANSWERED and ANSWERED polls.</p>
      </div>
    </div>
  );
}

export default Dashboard;