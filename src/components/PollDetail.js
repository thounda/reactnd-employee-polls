/**
 * File: src/components/PollDetail.js
 * Description: Component for viewing the details of a single poll.
 * If the user hasn't voted, they can vote. If they have voted, they see the results.
 */
import React from 'react';

function PollDetail() {
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Poll Details</h2>
      <div className="p-6 border border-gray-200 rounded-lg bg-purple-50 text-purple-700">
        <p className="font-semibold">Placeholder Content</p>
        <p>This will display either the voting form or the poll results for a specific question ID.</p>
      </div>
    </div>
  );
}

export default PollDetail;