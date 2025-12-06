/**
 * File: src/components/NewPoll.js
 * Description: Component for creating a new "Would You Rather...?" question/poll.
 */
import React from 'react';

function NewPoll() {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Create New Poll</h2>
      <div className="p-6 border border-gray-200 rounded-lg bg-yellow-50 text-yellow-700">
        <p className="font-semibold">Placeholder Content</p>
        <p>This page will host the form for submitting Option One and Option Two.</p>
      </div>
    </div>
  );
}

export default NewPoll;