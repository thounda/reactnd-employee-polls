/**
 * File: src/components/Leaderboard.js
 * Description: Component that displays a ranked list of users based on their scores
 * (questions asked + questions answered).
 */
import React from 'react';

function Leaderboard() {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Leaderboard</h2>
      <div className="p-6 border border-gray-200 rounded-lg bg-green-50 text-green-700">
        <p className="font-semibold">Placeholder Content</p>
        <p>This is where the ranked list of employees will be displayed.</p>
      </div>
    </div>
  );
}

export default Leaderboard;