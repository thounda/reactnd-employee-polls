/**
 * File: src/components/NewPoll.js
 * Description: Component for creating a new "Would You Rather...?" poll.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleAddQuestion } from '../actions/questions.js';
import { useNavigate } from 'react-router-dom';

class NewPoll extends Component {
  state = {
    optionOneText: '',
    optionTwoText: '',
  };

  /**
   * Updates state based on input changes for option one or two.
   */
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handles form submission, dispatches the thunk, and redirects.
   */
  handleSubmit = (e) => {
    e.preventDefault();

    const { optionOneText, optionTwoText } = this.state;
    const { dispatch, navigate } = this.props;

    if (optionOneText && optionTwoText) {
      // Dispatch the thunk to save the new question
      dispatch(handleAddQuestion(optionOneText, optionTwoText));
      
      this.setState({
        optionOneText: '',
        optionTwoText: '',
      });

      // Redirect the user to the dashboard after submission
      navigate('/');
    } else {
      console.warn('Both options are required to create a new poll.');
    }
  };

  render() {
    const { optionOneText, optionTwoText } = this.state;
    const isSubmitDisabled = !optionOneText || !optionTwoText;

    return (
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white text-center">
          <h2 className="text-2xl font-semibold">Create a New Poll</h2>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Would You Rather...</h1>
          
          <form onSubmit={this.handleSubmit} className="space-y-6">
            {/* Option One Input */}
            <div>
              <label htmlFor="optionOneText" className="block text-sm font-medium text-gray-700 mb-1">
                Option One:
              </label>
              <input
                id="optionOneText"
                name="optionOneText"
                type="text"
                value={optionOneText}
                onChange={this.handleChange}
                placeholder="Enter option one text here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                maxLength={100}
                required
              />
            </div>

            {/* Separator */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 font-semibold italic">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Option Two Input */}
            <div>
              <label htmlFor="optionTwoText" className="block text-sm font-medium text-gray-700 mb-1">
                Option Two:
              </label>
              <input
                id="optionTwoText"
                name="optionTwoText"
                type="text"
                value={optionTwoText}
                onChange={this.handleChange}
                placeholder="Enter option two text here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                maxLength={100}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full py-3 px-4 rounded-xl shadow-md text-white font-semibold bg-green-600 hover:bg-green-700 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              Submit Poll
            </button>
          </form>
        </div>
      </div>
    );
  }
}

// HOC for wrapping the class component to allow use of the navigate hook
const NewPollWrapper = (props) => {
  const navigate = useNavigate();
  return <NewPoll {...props} navigate={navigate} />;
};

// Connect the wrapped component to Redux dispatch
export default connect()(NewPollWrapper);