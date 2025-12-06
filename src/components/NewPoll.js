/**
 * File: src/components/NewPoll.js
 * Description: Component for creating a new "Would You Rather...?" question/poll.
 * It dispatches the handleAddQuestion thunk and redirects to the dashboard upon success.
 */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleAddQuestion } from '../actions/questions.js';

function NewPoll() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for the two poll options
  const [optionOneText, setOptionOneText] = useState('');
  const [optionTwoText, setOptionTwoText] = useState('');
  const [loading, setLoading] = useState(false);

  const isFormInvalid = !optionOneText || !optionTwoText;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormInvalid) {
      alert('Please fill out both options before submitting the poll.');
      return;
    }

    setLoading(true);

    // Dispatch the thunk action to save the new question
    dispatch(handleAddQuestion(optionOneText, optionTwoText))
      .then(() => {
        // Clear form fields and loading state
        setOptionOneText('');
        setOptionTwoText('');
        setLoading(false);
        
        // Redirect the user to the home dashboard upon successful creation
        navigate('/');
      })
      .catch((error) => {
        setLoading(false);
        console.error("Failed to add new question:", error);
        alert('There was an error creating the poll. Please try again.');
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-2 text-center">
        Create New Poll
      </h2>
      <p className="text-center text-xl text-gray-500 mb-8">
        Complete the question:
      </p>

      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Would You Rather...
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Option One Input */}
          <div>
            <label htmlFor="optionOne" className="block text-lg font-medium text-gray-700 mb-1">
              Option One:
            </label>
            <input
              id="optionOne"
              type="text"
              placeholder="e.g., be a bird"
              value={optionOneText}
              onChange={(e) => setOptionOneText(e.target.value)}
              className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-150"
              required
              disabled={loading}
            />
          </div>

          <div className="relative flex justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-gray-50 text-xl font-bold text-gray-500">
                OR
              </span>
            </div>
          </div>

          {/* Option Two Input */}
          <div>
            <label htmlFor="optionTwo" className="block text-lg font-medium text-gray-700 mb-1">
              Option Two:
            </label>
            <input
              id="optionTwo"
              type="text"
              placeholder="e.g., be a fish"
              value={optionTwoText}
              onChange={(e) => setOptionTwoText(e.target.value)}
              className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-150"
              required
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isFormInvalid || loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Question'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewPoll;