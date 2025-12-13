/**
 * File: src/components/UnansweredPoll.js
 * Description: Renders the form for an authenticated user to answer an unanswered poll.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { handleSaveQuestionAnswer } from '../actions/questions.js';

class UnansweredPoll extends Component {
  state = {
    selectedOption: '', // Stores 'optionOne' or 'optionTwo'
  };

  /**
   * Handles selection change in the radio buttons.
   */
  handleChange = (e) => {
    this.setState({
      selectedOption: e.target.value,
    });
  };

  /**
   * Handles form submission, dispatching the thunk to save the answer.
   */
  handleSubmit = (e) => {
    e.preventDefault();

    const { selectedOption } = this.state;
    const { dispatch, question, authedUser } = this.props;

    if (selectedOption !== '') {
      // Dispatch the thunk to save the answer in the API and update Redux store
      dispatch(handleSaveQuestionAnswer(authedUser, question.id, selectedOption));
      
      // Note: The UI will automatically switch to the AnsweredPoll view 
      // because the Redux state (isAnswered) will change.
      this.setState({ selectedOption: '' });
    } else {
      console.warn('Please select an option before submitting.');
    }
  };

  render() {
    const { question } = this.props;
    const { selectedOption } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="w-full space-y-6 px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Choose One:</h2>
        
        {/* Option One */}
        <label className="flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out">
          <input
            type="radio"
            name="poll-option"
            value="optionOne"
            checked={selectedOption === 'optionOne'}
            onChange={this.handleChange}
            className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <span className="ml-3 text-lg font-medium text-gray-800">
            {question.optionOne.text}
          </span>
        </label>

        {/* Separator */}
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 font-semibold italic">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Option Two */}
        <label className="flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-indigo-50 transition duration-150 ease-in-out">
          <input
            type="radio"
            name="poll-option"
            value="optionTwo"
            checked={selectedOption === 'optionTwo'}
            onChange={this.handleChange}
            className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
          />
          <span className="ml-3 text-lg font-medium text-gray-800">
            {question.optionTwo.text}
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedOption}
          className="w-full py-3 px-4 rounded-xl shadow-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          Submit Answer
        </button>
      </form>
    );
  }
}

// Connect the component to dispatch only (state is passed via PollDetail props)
export default connect()(UnansweredPoll);